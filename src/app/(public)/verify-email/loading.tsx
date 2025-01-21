import { pollsensei_new_logo } from "@/assets/images";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center">
          <Image
            src={pollsensei_new_logo}
            alt="PollSensei Logo"
            className="w-48 mb-8"
          />
          <ClipLoader color="#9D50BB" size={50} />
          <p className="text-gray-600 mt-4">Loading verification page...</p>
        </div>
      </div>
    </div>
  );
}
