import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { FiSearch } from "react-icons/fi";

import { type UserPublic, UsersService } from "@/client";
import AddUser from "@/components/Admin/AddUser";
import { UserActionsMenu } from "@/components/Common/UserActionsMenu";
import PendingTable from "@/components/Pending/PendingTable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const usersSearchSchema = z.object({
  page: z.number().catch(1),
});

const PER_PAGE = 10;

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  };
}

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  validateSearch: (search) => usersSearchSchema.parse(search),
});

function UsersTable() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (page: number) => {
    navigate({
      to: "/admin",
      search: (prev) => ({ ...prev, page }),
    });
  };

  const users = data?.data.slice(0, PER_PAGE) ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / PER_PAGE);

  if (users.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <FiSearch />
        </EmptyMedia>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>Add a new user to get started</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  if (isLoading) {
    return <PendingTable />;
  }

  return (
    <>
      <Table className="w-full border rounded-lg shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-left font-semibold">
              Full name
            </TableHead>
            <TableHead className="px-4 py-2 text-left font-semibold">
              Email
            </TableHead>
            <TableHead className="px-4 py-2 text-left font-semibold">
              Role
            </TableHead>
            <TableHead className="px-4 py-2 text-left font-semibold">
              Status
            </TableHead>
            <TableHead className="px-4 py-2 text-left font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow
              key={user.id}
              className={`hover:bg-muted/50 transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
            >
              <TableCell
                className={`px-4 py-2 ${!user.full_name ? "text-gray-400" : ""}`}
              >
                {user.full_name || "N/A"}
                {currentUser?.id === user.id && (
                  <span className="ml-2 text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded text-xs">
                    You
                  </span>
                )}
              </TableCell>
              <TableCell
                className="px-4 py-2 max-w-[150px] truncate"
                title={user.email}
              >
                {user.email}
              </TableCell>
              <TableCell className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${user.is_superuser ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                >
                  {user.is_superuser ? "Superuser" : "User"}
                </span>
              </TableCell>
              <TableCell className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="px-4 py-2">
                <UserActionsMenu
                  user={user}
                  disabled={currentUser?.id === user.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(totalPages, page + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

function Admin() {
  return (
    <div>
      <div className="text-2xl font-bold mb-4">Users Management</div>
      <AddUser />
      <UsersTable />
    </div>
  );
}
