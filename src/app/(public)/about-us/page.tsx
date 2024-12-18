"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AboutUsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return null;
};

export default AboutUsPage;

// "use client";

// import React, { useEffect } from "react";
// import Link from "next/link";
// import NavBar from "@/components/blocks/NavBar";
// import {
//   FaLandmark,
//   FaLightbulb,
//   FaHistory,
//   FaRocket,
//   FaUsers,
//   FaShieldAlt,
// } from "react-icons/fa";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Footer from "@/components/blocks/Footer";

// const AboutUsPage: React.FC = () => {
//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800">
//       <NavBar />
//       <main className="container mx-auto px-4 py-16">
//         <h1
//           className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#5B03B2]"
//           data-aos="fade-down"
//         >
//           About Us
//         </h1>
//         <p
//           className="text-xl text-center mb-12 text-gray-600"
//           data-aos="fade-up"
//         >
//           Empowering businesses with innovative survey solutions
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
//           <div
//             className="bg-white rounded-xl p-8 shadow-lg"
//             data-aos="fade-right"
//           >
//             <div className="flex items-center mb-4">
//               <FaLandmark className="text-3xl text-[#5B03B2] mr-4" />
//               <h2 className="text-2xl font-semibold text-[#5B03B2]">
//                 Our Mission
//               </h2>
//             </div>
//             <p className="text-gray-600">
//               At SurveyPro, our mission is to revolutionize the way businesses
//               gather and analyze data. We&apos;re committed to providing
//               powerful, user-friendly survey tools that help organizations make
//               informed decisions and drive growth.
//             </p>
//           </div>
//           <div
//             className="bg-white rounded-xl p-8 shadow-lg"
//             data-aos="fade-left"
//           >
//             <div className="flex items-center mb-4">
//               <FaLightbulb className="text-3xl text-[#5B03B2] mr-4" />
//               <h2 className="text-2xl font-semibold text-[#5B03B2]">
//                 Our Vision
//               </h2>
//             </div>
//             <p className="text-gray-600">
//               We envision a world where every business, regardless of size, has
//               access to advanced survey technology. Our goal is to democratize
//               data collection and analysis, enabling companies to unlock
//               valuable insights and enhance their operations.
//             </p>
//           </div>
//         </div>

//         <div
//           className="bg-white rounded-xl p-8 shadow-lg mb-16"
//           data-aos="fade-up"
//         >
//           <div className="flex items-center mb-4">
//             <FaHistory className="text-3xl text-[#5B03B2] mr-4" />
//             <h2 className="text-2xl font-semibold text-[#5B03B2]">Our Story</h2>
//           </div>
//           <p className="text-gray-600 mb-4">
//             Founded in 2015 by a team of data scientists and UX experts,
//             SurveyPro was born out of the need for more intuitive and powerful
//             survey tools. We&apos;ve grown from a small startup to a leading
//             provider of survey solutions, serving thousands of businesses
//             worldwide.
//           </p>
//           <p className="text-gray-600">
//             Our journey has been driven by continuous innovation and a deep
//             understanding of our clients&apos; needs. We&apos;re proud of how
//             far we&apos;ve come, but we&apos;re even more excited about the
//             future and the new ways we&apos;ll help businesses thrive through
//             data-driven insights.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//           <div
//             className="bg-white rounded-xl p-8 shadow-lg"
//             data-aos="fade-up"
//             data-aos-delay="100"
//           >
//             <div className="flex items-center mb-4">
//               <FaRocket className="text-3xl text-[#5B03B2] mr-4" />
//               <h3 className="text-xl font-semibold text-[#5B03B2]">
//                 Innovation
//               </h3>
//             </div>
//             <p className="text-gray-600">
//               We&apos;re constantly pushing the boundaries of what&apos;s
//               possible in survey technology, integrating AI and machine learning
//               to provide deeper insights.
//             </p>
//           </div>
//           <div
//             className="bg-white rounded-xl p-8 shadow-lg"
//             data-aos="fade-up"
//             data-aos-delay="200"
//           >
//             <div className="flex items-center mb-4">
//               <FaUsers className="text-3xl text-[#5B03B2] mr-4" />
//               <h3 className="text-xl font-semibold text-[#5B03B2]">
//                 User-Centric Design
//               </h3>
//             </div>
//             <p className="text-gray-600">
//               Our tools are designed with the user in mind, ensuring that even
//               complex survey tasks are intuitive and easy to execute.
//             </p>
//           </div>
//           <div
//             className="bg-white rounded-xl p-8 shadow-lg"
//             data-aos="fade-up"
//             data-aos-delay="300"
//           >
//             <div className="flex items-center mb-4">
//               <FaShieldAlt className="text-3xl text-[#5B03B2] mr-4" />
//               <h3 className="text-xl font-semibold text-[#5B03B2]">
//                 Data Security
//               </h3>
//             </div>
//             <p className="text-gray-600">
//               We prioritize the security and privacy of our clients&apos; data,
//               implementing robust measures to protect sensitive information.
//             </p>
//           </div>
//         </div>

//         <div className="text-center" data-aos="fade-up">
//           <h2 className="text-2xl font-semibold mb-4">
//             Ready to transform your data collection?
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Join thousands of businesses that trust SurveyPro for their survey
//             needs.
//           </p>
//           <Link
//             href="/register"
//             className="inline-block bg-[#5B03B2] text-white px-6 py-3 rounded-full hover:bg-opacity-80 transition-colors duration-300"
//           >
//             Get Started Today
//           </Link>
//         </div>
//       </main>
//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default AboutUsPage;
