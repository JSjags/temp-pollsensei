import "./style.css";
import Image from "next/image";
import arrow from "../../assets/images/ui/aright-arrow.svg";

interface TopResponseProps {
  id: number;
  title: string;
  value: number;
}

const TopResponse: React.FC<TopResponseProps> = ({ id, title, value }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center rate-id">{id}</div>
        <div className="flex flex-col gap-1">
          <p className="rate-title">{title}</p>
          <p className="rate-value">{`${value} responses`}</p>
        </div>
      </div>
      <Image
        src={arrow}
        className="cursor-pointer"
        alt=""
        width={24}
        height={24}
      />
    </div>
  );
};

export default TopResponse;
