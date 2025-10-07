import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiSearch } from "react-icons/fi";
import { z } from "zod";

import { ItemsService, type ItemPublic } from "@/client";
import { ItemActionsMenu } from "@/components/Common/ItemActionsMenu";
import AddItem from "@/components/Items/AddItem";
import PendingItems from "@/components/Pending/PendingTable";
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

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

const getItemsQueryOptions = (page: number) => ({
  queryKey: ["items", { page }],
  queryFn: () =>
    ItemsService.readItems({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
});

export const Route = createFileRoute("/_layout/items")({
  component: ItemsComponent,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

function ItemsHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Items Management</h2>
      <AddItem />
    </div>
  );
}

function ItemsTable({
  items,
  isPlaceholderData,
}: {
  items: ItemPublic[];
  isPlaceholderData: boolean;
}) {
  if (items.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <FiSearch />
        </EmptyMedia>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>You don't have any items yet</EmptyTitle>
            <EmptyDescription>Add a new item to get started.</EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Table className="w-full border rounded-lg shadow-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id}
            className={`hover:bg-muted/50 transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
          >
            <TableCell className="font-medium">
              {item.id.slice(0, 8)}...
            </TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell
              className={!item.description ? "text-muted-foreground" : ""}
            >
              {item.description || "N/A"}
            </TableCell>
            <TableCell className="text-right">
              <ItemActionsMenu item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ItemsPagination({
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

function ItemsComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getItemsQueryOptions(page),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  const items = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <div className="space-y-4">
      <ItemsHeader />
      {isLoading ? (
        <PendingItems />
      ) : (
        <>
          <ItemsTable items={items} isPlaceholderData={isPlaceholderData} />
          <ItemsPagination page={page} count={count} setPage={setPage} />
        </>
      )}
    </div>
  );
}
