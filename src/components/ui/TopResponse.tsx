// import "./style.css";
// import Image from "next/image";
// import arrow from "../../assets/images/ui/aright-arrow.svg";
// import Link from "next/link";

// interface TopResponseProps {
//   id: number;
//   title: string;
//   link?: string;
//   value: number;
// }

// const TopResponse: React.FC<TopResponseProps> = ({ id, title, value, link }) => {
//   return (
//     <div className="flex w-full items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="flex justify-center items-center rate-id">{id}</div>
//         <div className="flex flex-col gap-1">
//           <p className="rate-title">{title}...</p>
//           <p className="rate-value">{`${value} responses`}</p>
//         </div>
//       </div>
//       <Link href={link}>
//       <Image
//         src={arrow}
//         className="cursor-pointer"
//         alt=""
//         width={24}
//         height={24}
//         />
//         </Link>
//     </div>
//   );
// };

// export default TopResponse;

import "./style.css";
import Image from "next/image";
import arrow from "../../assets/images/ui/aright-arrow.svg";
import Link from "next/link";

interface TopResponseProps {
  id: number;
  title: string;
  link?: string;
  value: number;
}

const TopResponse: React.FC<TopResponseProps> = ({
  id,
  title,
  value,
  link,
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center rate-id font-bold">
          {id === 1 ? (
            "1"
          ) : id === 2 ? (
            "2"
          ) : id === 3 ? (
            "3"
          ) : (
            <span className="text-xs">{id}</span>
          )}
          <sup className="font-semibold">
            {id === 1 ? "st" : id === 2 ? "nd" : id === 3 ? "rd" : "th"}
          </sup>
        </div>
        <div className="flex flex-col gap-1">
          <p className="rate-title">{title}...</p>
          <p className="rate-value">{`${value} responses`}</p>
        </div>
      </div>
      {link ? (
        <Link href={link}>
          <Image
            src={arrow}
            className="cursor-pointer"
            alt=""
            width={24}
            height={24}
          />
        </Link>
      ) : (
        <Image
          src={arrow}
          className="cursor-default opacity-50"
          alt=""
          width={24}
          height={24}
        />
      )}
    </div>
  );
};

export default TopResponse;
