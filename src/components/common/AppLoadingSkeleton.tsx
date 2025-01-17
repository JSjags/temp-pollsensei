import { cn } from "@/lib/utils";

interface Props {
  className: string;
}

const AppLoadingSkeleton = ({ className }: Props): JSX.Element => {
  return (
    <div
      className={cn("animate-pulse rounded-full bg-gray-400/50", className)}
    />
  );
};

export default AppLoadingSkeleton;
