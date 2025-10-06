import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiSearch } from "react-icons/fi";
import { z } from "zod";

import { ItemsService } from "@/client";
import { ItemActionsMenu } from "@/components/Common/ItemActionsMenu";
import AddItem from "@/components/Items/AddItem";
import PendingItems from "@/components/Pending/PendingTable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

const PER_PAGE = 10;

function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ItemsService.readItems({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["items", { page }],
  };
}

export const Route = createFileRoute("/_layout/items")({
  component: Items,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

function ItemsTable() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getItemsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (page: number) => {
    navigate({
      to: "/items",
      search: (prev) => ({ ...prev, page }),
    });
  };

  const items = data?.data.slice(0, PER_PAGE) ?? [];
  const count = data?.count ?? 0;

  if (isLoading) {
    return <PendingItems />;
  }

  if (items.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <FiSearch />
        </EmptyMedia>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>You don't have any items yet</EmptyTitle>
            <EmptyDescription>Add a new item to get started</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <Table className="w-full border rounded-lg shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] px-4 py-2 text-left font-semibold">
              ID
            </TableHead>
            <TableHead className="px-4 py-2 text-left font-semibold">
              Title
            </TableHead>
            <TableHead className="px-4 py-2 text-left font-semibold">
              Description
            </TableHead>
            <TableHead className="w-[100px] px-4 py-2 text-right font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow
              key={item.id}
              className={`hover:bg-muted/50 transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
            >
              <TableCell className="px-4 py-2 font-medium">
                {item.id.slice(0, 8)}...
              </TableCell>
              <TableCell className="px-4 py-2">{item.title}</TableCell>
              <TableCell
                className={`px-4 py-2 ${!item.description ? "text-muted-foreground" : ""}`}
              >
                {item.description || "N/A"}
              </TableCell>
              <TableCell className="px-4 py-2 text-right">
                <ItemActionsMenu item={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
              />
            </PaginationItem>
            {Array.from({ length: Math.ceil(count / PER_PAGE) }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {count > PER_PAGE * 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage(page < Math.ceil(count / PER_PAGE) ? page + 1 : page)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

function Items() {
  return (
    <div>
      <div className="mb-4 text-2xl font-bold">Items Management</div>
      <AddItem />
      <ItemsTable />
    </div>
  );
}
