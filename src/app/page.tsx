// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef, useEffect } from "react";
// import {
//   FaRocket,
//   FaA,
//   FaChartLine,
//   FaTwitter,
//   FaFacebook,
//   FaLinkedin,
//   FaInstagram,
// } from "react-icons/fa6";
// import MatrixRain from "@/components/custom/MatrixRain";
// import NavBar from "@/components/blocks/NavBar";
// import Footer from "@/components/blocks/Footer";

// interface FeatureCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   delay: number;
//   y: any;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({
//   icon,
//   title,
//   description,
//   delay,
//   y,
// }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 50 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8, delay }}
//     className="bg-white bg-opacity-5 p-6 sm:p-8 rounded-xl backdrop-blur-lg hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105 border border-white border-opacity-20"
//   >
//     <div className="text-3xl sm:text-4xl mb-4 text-purple-300">{icon}</div>
//     <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
//       {title}
//     </h2>
//     <p className="text-sm sm:text-base text-gray-200">{description}</p>
//   </motion.div>
// );

// const Home: React.FC = () => {
//   const { scrollYProgress } = useScroll();
//   const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
//   const testimonialsRef = useRef<HTMLDivElement>(null);

//   const featureCardY = useTransform(scrollYProgress, [0, 1], [0, 100]);

//   return (
//     <main className="min-h-screen">
//       <NavBar />
//       <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#4a2075] text-white overflow-hidden">
//         {/* Hero Section */}
//         <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
//           <MatrixRain />
//           <motion.div
//             style={{ y }}
//             className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
//           >
//             {/* <Image
//             src="/images/abstract-bg.svg"
//             alt="Abstract Background"
//             layout="fill"
//             objectFit="cover"
//           /> */}
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             className="text-center relative z-10"
//           >
//             <motion.h1
//               initial={{ opacity: 0, y: -50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-white"
//             >
//               PollSensei
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white"
//             >
//               Unleash the power of AI-driven surveys. Craft, analyze, and
//               innovate with unparalleled precision.
//             </motion.p>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="inline-block"
//             >
//               <Link
//                 href="/register"
//                 className="relative inline-block bg-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg overflow-hidden group"
//               >
//                 <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//                 <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center">
//                   Begin Your Journey
//                 </span>
//               </Link>
//             </motion.div>
//           </motion.div>
//         </section>

//         {/* Features Section */}
//         <section className="py-16 sm:py-24 bg-gradient-to-b from-indigo-900 to-purple-900 overflow-hidden">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="container mx-auto px-4 sm:px-6 lg:px-8"
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
//               {[
//                 {
//                   icon: <FaRocket />,
//                   title: "Intuitive Design",
//                   description:
//                     "Craft surveys with ease using our sleek, user-friendly interface. Tailor every aspect to your needs effortlessly.",
//                   delay: 0.2,
//                 },
//                 {
//                   icon: <FaA />,
//                   title: "AI Assistance",
//                   description:
//                     "Harness cutting-edge AI to generate insightful questions and options, saving time and enhancing survey quality.",
//                   delay: 0.4,
//                 },
//                 {
//                   icon: <FaChartLine />,
//                   title: "Advanced Analytics",
//                   description:
//                     "Dive deep into your data with powerful analytics tools. Uncover trends and make informed decisions with ease.",
//                   delay: 0.6,
//                 },
//               ].map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 100 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.8, delay: feature.delay }}
//                   whileHover={{ scale: 1.05, rotateY: 15, z: 50 }}
//                   style={{ perspective: 1000 }}
//                 >
//                   <motion.div
//                     style={{
//                       y: featureCardY,
//                     }}
//                   >
//                     <FeatureCard
//                       icon={feature.icon}
//                       title={feature.title}
//                       description={feature.description}
//                       delay={feature.delay}
//                       y={featureCardY}
//                     />
//                   </motion.div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </section>

//         {/* Testimonials Section */}
//         <section
//           ref={testimonialsRef}
//           className="py-16 sm:py-24 bg-white relative overflow-hidden"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center relative z-10 mb-12 px-4 sm:px-6 lg:px-8"
//           >
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-purple-900">
//               What Our Users Say
//             </h2>
//             <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto text-gray-700">
//               Discover how PollSensei has transformed survey experiences for
//               businesses worldwide.
//             </p>
//           </motion.div>

//           <motion.div
//             className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 px-4 sm:px-6 lg:px-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8, staggerChildren: 0.2 }}
//           >
//             {[
//               {
//                 name: "John Doe",
//                 role: "Marketing Director",
//                 company: "TechCorp",
//                 testimonial:
//                   "PollSensei revolutionized our market research. The AI-powered insights are game-changing!",
//               },
//               {
//                 name: "Jane Smith",
//                 role: "HR Manager",
//                 company: "Global Industries",
//                 testimonial:
//                   "Employee feedback has never been easier to collect and analyze. PollSensei is a must-have tool.",
//               },
//               {
//                 name: "Alex Johnson",
//                 role: "Product Owner",
//                 company: "InnovateTech",
//                 testimonial:
//                   "The intuitive design and powerful analytics have significantly improved our product development process.",
//               },
//               {
//                 name: "Sarah Lee",
//                 role: "Customer Experience Lead",
//                 company: "RetailGiant",
//                 testimonial:
//                   "PollSensei helped us uncover crucial customer insights that drove our satisfaction scores through the roof.",
//               },
//             ].map((testimonial, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-purple-100 p-6 rounded-lg shadow-md w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.3 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//               >
//                 <p className="text-gray-700 mb-4 text-sm sm:text-base">
//                   &ldquo;{testimonial.testimonial}&rdquo;
//                 </p>
//                 <p className="font-bold text-purple-900 text-sm sm:text-base">
//                   {testimonial.name}
//                 </p>
//                 <p className="text-xs sm:text-sm text-gray-600">
//                   {testimonial.role}, {testimonial.company}
//                 </p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-16 bg-gradient-to-r from-purple-700 to-indigo-800 px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center"
//           >
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-white">
//               Ready to Transform Your Survey Process?
//             </h2>
//             <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
//               <motion.div
//                 className="w-full sm:w-auto"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Link
//                   href="/signup"
//                   className="block w-full sm:w-auto bg-white text-purple-700 font-bold py-3 px-8 rounded-full hover:bg-purple-100 transition duration-300 text-base sm:text-lg shadow-md"
//                 >
//                   Join PollSensei
//                 </Link>
//               </motion.div>
//               <motion.div
//                 className="w-full sm:w-auto"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Link
//                   href="/login"
//                   className="block w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-purple-700 transition duration-300 text-base sm:text-lg"
//                 >
//                   Log In
//                 </Link>
//               </motion.div>
//             </div>
//           </motion.div>
//         </section>
//         {/* Footer */}
//         <Footer />
//       </div>
//     </main>
//   );
// };

// export default Home;

"use client";

import LandingPage from "@/components/publicPages/LandingPage";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <>
      <LandingPage />
    </>
  );
};

export default Page;

