import { carbonible, escrotech, gidiOaks, invEmt, oaks } from "@/assets/images";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const MarqueSlider = () => {
  return (
    <Marquee autoFill={true} pauseOnHover={true}>
    {[gidiOaks, oaks, invEmt, carbonible, escrotech].map((item, index)=>(
        <div key={index} className=' w-36 md:w-60 mx-10 mt-5'>
           <Image src={item} className="object-cover w-full px-4" alt="our partners logo" />
        </div>
    ))}
</Marquee>
  )
}

export default MarqueSlider
