"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { teamIcon } from "../../assets/images";
import ModalComponent from "./ModalComponent";
import "./style.css";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import { ClipLoader } from "react-spinners";
import {
  useGetTeamMembersQuery,
  useInviteMutation,
} from "../../services/team.service";
import { toast } from "react-toastify";
import MultiSelectField from "./MultipleSelect";
import InviteSuccess from "./InviteSuccess";
import { closeForm, openForm } from "../../redux/slices/form.slice";
import Input from "./Input";
import { RootState } from "../../redux/store";
import { useGetCollaboratorsListQuery, useInviteCollaboratorMutation } from "@/services/survey.service";
import { useParams } from "next/navigation";

interface FormValues {
  name: string;
  email: string;
  survey_id: string;
  role: Array<{ value: string; label: string }>;
}

const constraints = {
  name: {
    presence: true,
  },
  email: {
    presence: true,
    email: true,
  },
  role: {
    presence: true,
  },
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "",
    backgroundColor: "#F5FAFF",
    color: "#CC9BFD4D",
    outline: "none",
    padding: "12px 0 12px 1.3rem",
  }),
};

const NoCollaborator: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const survey_id = useParams()
  const [inviteSucc, setInviteSucc] = useState<boolean>(false);
  const [inviteCollaborator, { isSuccess, isError, error, isLoading }] =
  useInviteCollaboratorMutation();
  const { refetch } = useGetCollaboratorsListQuery(survey_id.id);

  console.log(survey_id.id)
  const dispatch = useDispatch();
  const formModal = useSelector((state: RootState) => state.form?.isFormOpen);

  const onSubmit = async (values: FormValues) => {
    try {
      setEmail(values.email);
      const inviteeDetails = {
        ...values,
        role: values.role.map((option) => option.value),
        survey_id:survey_id.id
      };
      await inviteCollaborator(inviteeDetails).unwrap();
      toast.success("Invitation sent, check email to continue");
      dispatch(closeForm());
      setInviteSucc(true);
      console.log("Invitation sent");
    } catch (err: any) {
      toast.error(
        "Failed to send invite " + (err?.data?.message || err.message)
      );
      console.error("Failed to send invite", err);
    }
  };

  const validateForm = (values: FormValues) => {
    return validate(values, constraints) || {};
  };

  return (
    <div className="flex items-center justify-center h-[]">
      {!inviteSucc && (
        <>
          {!formModal && (
            <div className="w-75 text-center mt-16">
              <Image
                src={teamIcon.src}
                alt="no team icon"
                width={70}
                height={70}
                className="mx-auto"
              />
              <p className="text-2xl font-bold mt-3">No collaborator yet</p>
              <p className="text-[#7A8699] font-normal text-[calc(1rem+2px)]">
                Invite people to your team to view your team members
              </p>
              <button
                className="auth-btn mt-5"
                onClick={() => dispatch(openForm())}
              >
                Invite Member
              </button>
            </div>
          )}
          {formModal && (
            <ModalComponent
              title="Add member"
              openModal={formModal}
              onClose={() => dispatch(closeForm())}
            >
              <Form<FormValues>
                onSubmit={onSubmit}
                validate={validateForm}
                render={({ handleSubmit, form, submitting }) => (
                  <form onSubmit={handleSubmit} className="w-full">
                    <Field name="name">
                      {({ input, meta }) => (
                        <Input
                          label="Name"
                          type="text"
                          placeholder="Enter your Name"
                          form={form}
                          {...input}
                        />
                      )}
                    </Field>

                    <Field name="email">
                      {({ input, meta }) => (
                        <Input
                          label="Email"
                          type="text"
                          placeholder="Enter your Email"
                          form={form}
                          {...input}
                        />
                      )}
                    </Field>

                    <Field name="role">
                      {({ input, meta }) => (
                        <MultiSelectField
                          input={input}
                          meta={{ ...meta, touched: !!meta.touched }}
                          options={options}
                          isMulti
                          styles={customStyles}
                          placeholder="Select role"
                          closeMenuOnSelect={false}
                          className="basic-multi-select rounded-full"
                          classNamePrefix="role"
                          label="Role"
                        />
                      )}
                    </Field>

                    <div className="flex gap-5 mt-5">
                      <button
                        className="auth-btn w-[] justify-center"
                        type="submit"
                        disabled={submitting || isLoading}
                      >
                        {submitting || isLoading ? (
                          <ClipLoader size={20} />
                        ) : (
                          "Send Invite"
                        )}
                      </button>

                      <button
                        className="text-[#5B03B2] border-none"
                        type="button"
                        onClick={() => dispatch(closeForm())}
                      >
                        Cancel
                      </button>
                    </div>

                    {isSuccess && (
                      <p className="text-green-600">
                        User invited successfully!
                      </p>
                    )}
                    {isError && (
                      <p className="text-red-600">
                        Failed to invite user:{" "}
                        {(error as any)?.data?.message ||
                          (error as Error).message}
                      </p>
                    )}
                  </form>
                )}
              />
            </ModalComponent>
          )}
        </>
      )}

      {inviteSucc && (
        <InviteSuccess
          email={email}
          onClick={() => {
            setInviteSucc(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default NoCollaborator;

const options = [
  { value: "Data Collector", label: "Data Collector" },
  { value: "Data Validator", label: "Data Validator" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Data Editor", label: "Data Editor" },
];
