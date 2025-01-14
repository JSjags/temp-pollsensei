import Link from "next/link";
import { GoDownload } from "react-icons/go";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  url?: string;
  isLoading: boolean;
  isSuccess: boolean;
}

export function DownloadPDF({ url, isLoading, isSuccess }: Props) {
  if (isLoading) {
    return <Skeleton className="h-12 w-full" />;
  }

  return (
    <Link href={url || ""} target="blank" download className="block">
      <button className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-lg gap-2">
        <GoDownload size={20} />
        Download as PDF
      </button>
    </Link>
  );
}
