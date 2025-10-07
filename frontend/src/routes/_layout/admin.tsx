import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiSearch } from "react-icons/fi";
import { z } from "zod";

import { type UserPublic, UsersService } from "@/client";
import AddUser from "@/components/Admin/AddUser";
import { UserActionsMenu } from "@/components/Common/UserActionsMenu";
import PendingTable from "@/components/Pending/PendingTable";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PER_PAGE = 10;

const usersSearchSchema = z.object({
  page: z.number().catch(1),
});

const getUsersQueryOptions = (page: number) => ({
  queryKey: ["users", { page }],
  queryFn: () =>
    UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
});

export const Route = createFileRoute("/_layout/admin")({
  component: AdminComponent,
  validateSearch: (search) => usersSearchSchema.parse(search),
});

function AdminHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Users Management</h2>
      <AddUser />
    </div>
  );
}

function UsersTable({
  users,
  isPlaceholderData,
}: {
  users: UserPublic[];
  isPlaceholderData: boolean;
}) {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  if (users.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <FiSearch />
        </EmptyMedia>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>Add a new user to get started.</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Table className="w-full border rounded-lg shadow-sm">
      <TableHeader>
        <TableRow>
          <TableHead>Full name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className={`hover:bg-muted/50 transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
          >
            <TableCell className="font-medium">
              {user.full_name || "N/A"}
              {currentUser?.id === user.id && (
                <span className="ml-2 text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded text-xs">
                  You
                </span>
              )}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${user.is_superuser ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
              >
                {user.is_superuser ? "Superuser" : "User"}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <UserActionsMenu
                user={user}
                disabled={currentUser?.id === user.id}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function UsersPagination({
  page,
  count,
  setPage,
}: {
  page: number;
  count: number;
  setPage: (page: number) => void;
}) {
  const totalPages = Math.ceil(count / PER_PAGE);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(1, page - 1))}
              isActive={page > 1}
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
              isActive={page < totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function AdminComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions(page),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  const users = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <div className="space-y-4">
      <AdminHeader />
      {isLoading ? (
        <PendingTable />
      ) : (
        <>
          <UsersTable users={users} isPlaceholderData={isPlaceholderData} />
          <UsersPagination page={page} count={count} setPage={setPage} />
        </>
      )}
    </div>
  );
}
