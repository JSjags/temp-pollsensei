"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validate } from "validate.js";
import { Field, Form } from "react-final-form";
import { ClipLoader } from "react-spinners";

import NoTeam from "../../components/ui/NoTeam";
import Navbar from "../../components/navbar/Navbar";
import Button from "../../components/common/Button";
import MembersTable from "./MembersTable";
import ModalComponent from "../../components/ui/ModalComponent";
import MultiSelectField from "../../components/ui/MultipleSelect";
import InviteSuccess from "../../components/ui/InviteSuccess";

import {
  useGetTeamMembersQuery,
  useInviteMutation,
} from "../../services/team.service";
import { toggle } from "../../redux/slices/invite.slice";
import Input from "@/components/ui/Input";

interface FormValues {
  name: string;
  email: string;
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

const TeamMembersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { data, refetch } = useGetTeamMembersQuery({});
  const [email, setEmail] = useState<string>("");
  const [noTeamState, setNoTeamState] = useState<boolean>(false);
  const [inviteSucc, setInviteSucc] = useState<boolean>(false);
  const [memberTableState, setMemberTableState] = useState<boolean>(true);
  const [invite, { isSuccess, isError, error, isLoading }] =
    useInviteMutation();

  const [isToggled, setIsToggled] = useState<boolean>(false);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  const handleNoTeam = () => {
    setNoTeamState((prev) => !prev);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setEmail(values.email);
      const inviteeDetails = {
        ...values,
        role: values.role.map((option) => option.value),
      };
      console.log(inviteeDetails);
      await invite(inviteeDetails).unwrap();
      toast.success("Invitation sent, check email to continue");
      handleToggle();
      setInviteSucc(!inviteSucc);
      setMemberTableState(!memberTableState);
      console.log("Invitation sent");
    } catch (err: any) {
      toast.error("Failed to send invite " + err?.data?.message || err.message);
      console.error("Failed to send invite", err);
    }
  };

  const validateForm = (values: FormValues) => {
    return validate(values, constraints) || {};
  };

  return (
    <>
      <div className="container">
        <div className="px-5 lg:px-0">
          <div className="flex my-10 items-center justify-between">
            <div className="flex gap-5 items-center">
              <h2 className="text-[#333333] font-normal text-[1.5rem]">
                Team Members
              </h2>
              <div className="flex justify-center items-center gap-2 bg-[#828282] rounded-[8px] border-[1px] px- border-[#d9d9d9] w-[40px] h-[40px]">
                0
              </div>
            </div>
            {data?.data?.data.length > 1 && (
              <Button label="Invite Member" onClick={handleToggle} />
            )}
          </div>
          {data?.data?.data.length === 1 && <NoTeam />}
          {data?.data?.data.length > 1 && (
            <MembersTable
              members={data?.data?.data}
              tableState={memberTableState}
            />
          )}

          {isToggled && (
            <ModalComponent
              title="Add members"
              openModal={isToggled}
              onClose={handleToggle}
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
                          // error={meta.touched && meta.error}
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
                          // error={meta.touched && meta.error}
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
                          label={"Role"}
                        />
                      )}
                    </Field>

                    <div className="flex gap-5 mt-5">
                      <button
                        className="auth-btn w-[1/2] justify-center"
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
                        className="text-[#5B03B2] border-none "
                        type="button"
                        onClick={() => dispatch(toggle())}
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
          {inviteSucc && (
            <InviteSuccess
              email={email}
              onClick={() => {
                setInviteSucc(!inviteSucc);
                setMemberTableState(!memberTableState);
                refetch();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TeamMembersPage;

const options = [
  { value: "Data Collector", label: "Data Collector" },
  { value: "Data Validator", label: "Data Validator" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Data Editor", label: "Data Editor" },
];
