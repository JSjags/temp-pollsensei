import React from "react";
import Image from "next/image";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Modal } from "flowbite-react";
import close from "./close.svg";
import Input from "../ui/Input";
import { toast } from "react-toastify";
import ModalComponent from "../ui/ModalComponent";
import { mail_bag } from "@/assets/images";

interface SubscribeProps {
  onClose: () => void;
  openModal: boolean;
}

const constraints = {
  name: {
    presence: true,
  },
  email: {
    presence: true,
    email: true,
  },
};

const Subscribe: React.FC<SubscribeProps> = ({ onClose, openModal }) => {
  let isLoading: any;

  const onSubmit = async (values: any) => {
    try {
      console.log("User registered successfully");
    } catch (err: any) {
      toast.error(
        "Failed to register user " + (err?.data?.message || err.message)
      );
      console.error("Failed to register user", err);
    }
  };

  const validateForm = (values: any) => {
    return validate(values, constraints) || {};
  };
  return (
 
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 w-[70%] relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute text-4xl top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>

          <div className="flex flex-col items-center gap-2">
        <Form
          onSubmit={onSubmit}
          validate={validateForm}
          render={({ handleSubmit, form, submitting, values }) => (
            <form
              onSubmit={handleSubmit}
              className="w-full flex justify-between items-center"
            >
              <div className="hidden md:flex flex-1 w-full">
                <Image
                  src={mail_bag}
                  alt="Logo"
                  width={200}
                  height={200}
                  className="w-full"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="font-medium text-2xl">
                  Subscribe to our newsletter
                </h2>
                <p className="text-[#838383] font-normal">
                  Stay updated to our latest news and updates
                </p>
                <Field name="name">
                  {({ input, meta }) => (
                    <Input
                      label="Name"
                      type="text"
                      placeholder="Enter your Name"
                      form={form as any}
                      {...input}
                      //   error={meta.touched && meta.error}
                    />
                  )}
                </Field>

                <Field name="email">
                  {({ input, meta }) => (
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your Email"
                      form={form as any}
                      {...input}
                      //   error={meta.touched && meta.error}
                    />
                  )}
                </Field>

                <button
                  className="auth-btn w-full justify-center mt-4"
                  type="submit"
                  disabled={submitting || isLoading}
                >
                  {submitting || isLoading ? (
                    <ClipLoader size={20} />
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </form>
          )}
        />
      </div>
        </div>
      </div>
  );
};

export default Subscribe;


