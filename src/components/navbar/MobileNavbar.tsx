import {
  IoArrowBack,
  IoArrowForward,
  IoAdd,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { useRouter } from "next/navigation";

const MobileNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white text-gray-500 border-t flex justify-between items-center px-6 py-2 shadow-md md:hidden">
      <button className="p-3 text-xl" 
      // onClick={() => router.back()}
      >
        <IoArrowBack size={25} />
      </button>
      <button
        className="p-3 text-xl rounded-full"
        onClick={() => console.log("Add new item")}
      >
        <IoAdd size={25} />
      </button>
      <button
        className="p-3 text-xl"
        onClick={() => console.log("Open options menu")}
      >
        <IoEllipsisHorizontal size={25} />
      </button>
      <button className="p-3 text-xl" onClick={() => console.log("Go forward")}>
        <IoArrowForward size={25} />
      </button>
    </nav>
  );
};

export default MobileNavbar;
