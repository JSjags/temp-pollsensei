import { cn } from "@/lib/utils";

interface Props {
  onRefectch?: () => void;
  className?: string;
  title?: string;
}

const EmptyTableData = ({
  onRefectch,
  className,
  title,
}: Props): JSX.Element => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 py-20 font-semibold text-gray-400",
        className
      )}
    >
      {/* <LineMdEmojiFrownTwotone className="-ml-1 text-7xl text-appGray300 md:text-8xl lg:text-9xl" /> */}
      <p>{title ?? "Sorry, no data found."}</p>
      {!!onRefectch && (
        <button onClick={onRefectch} className="app-button" type="button">
          Refetch
        </button>
      )}
    </div>
  );
};

export default EmptyTableData;
