import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const PendingItems = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-16">
          <Skeleton className="h-4 w-10" />
        </TableHead>
        <TableHead>
          <Skeleton className="h-4 w-20" />
        </TableHead>
        <TableHead>
          <Skeleton className="h-4 w-24" />
        </TableHead>
        <TableHead className="w-24">
          <Skeleton className="h-4 w-12" />
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {[...Array(10)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default PendingItems;
