"use client";

import { useState } from "react";
import { ChevronRight, Phone, Mail, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/shadcn-input";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formState);
    // Reset form after submission
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto p-4 py-8 md:pt-14">
      <nav className="mb-6 text-gray-500" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <a href="/help-centre" className="hover:text-purple-600">
              Help center
            </a>
            <ChevronRight className="h-4 w-4 mx-2" />
          </li>
          <li className="flex items-center text-foreground">Contact Us</li>
        </ol>
      </nav>

      <div className="bg-white mx-auto rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <motion.div
            className="w-full md:w-1/2 md:p-8 md:pl-20"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-gray-600 mb-6">
              Your questions and comments are important to us. Drop us a line
              and we&apos;ll get back to you soon!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Enter your Name"
                  required
                  className="mt-1 h-12 auth-input"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  required
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your comments or questions
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="Drop your comments"
                  required
                  className="mt-1 h-12 resize-none"
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                className="w-full auth-btn h-12 rounded text-white"
              >
                Send
              </Button>
            </form>
            <motion.div
              className="py-8 flex flex-wrap justify-start gap-6 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center">
                <PhoneCall className="h-5 w-5 mr-2" />
                <div>
                  <p className="text-xs font-bold">PHONE</p>
                  <p className="text-xs text-purple-600">+44 03 5432 1234</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a
                  href="mailto:info@pollsensei.com"
                  className="hover:underline"
                >
                  <div>
                    <p className="text-xs font-bold">EMAIL</p>
                    <p className="text-xs text-purple-600">
                      info@pollsensei.com
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="hidden md:block w-full md:w-1/2 bg-gray-100 max-w-[540px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="h-64 md:h-full relative bg-[url('/assets/contact-us/map.svg')] bg-cover bg-no-repeat bg-center">
              {/* <img src={map} alt="Map" className="w-full h-full object-cover" /> */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-purple-600 rounded-full animate-ping" />
                <div className="w-6 h-6 bg-purple-600 rounded-full absolute top-0" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
