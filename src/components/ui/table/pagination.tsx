import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};


export function PaginationControls({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
