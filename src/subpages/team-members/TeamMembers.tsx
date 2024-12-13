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
import MembersTable, { Member } from "./MembersTable";
import ModalComponent from "../../components/ui/ModalComponent";
import MultiSelectField from "../../components/ui/MultipleSelect";
import InviteSuccess from "../../components/ui/InviteSuccess";
import { RiMailSendLine } from "react-icons/ri";
import { Fade, Slide } from "react-awesome-reveal";

import {
  useGetTeamMembersQuery,
  useInviteMutation,
} from "../../services/team.service";
import { toggle } from "../../redux/slices/invite.slice";
import Input from "@/components/ui/Input";
import { Crown, Loader2 } from "lucide-react";
import { multiSelectCustomStyles } from "@/constants/multi-select";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editTeamMember, getTeamMembers } from "@/services/admin";
import PaginatorButtons from "@/components/ui/paginator-buttons";
import FilterButton from "@/components/filter/FilterButton";
import { IoFilterOutline } from "react-icons/io5";
import Image from "next/image";
import search from "../../assets/images/search.svg";
import Loading from "@/components/primitives/Loader";
import { teamIcon } from "@/assets/images";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { showModal } from "@/redux/slices/modal.slice";

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
    zIndex: "10000",
  }),
};

const TeamMembersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { data, refetch } = useGetTeamMembersQuery({});
  const [email, setEmail] = useState<string>("");
  const [noTeamState, setNoTeamState] = useState<boolean>(false);
  const [inviteSucc, setInviteSucc] = useState<boolean>(false);
  const [memberTableState, setMemberTableState] = useState<boolean>(true);
  const [invite, { isSuccess, isError, error, isLoading }] =
    useInviteMutation();

  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [member, setMember] = useState<Member | null>();

  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [isEditMemberToggled, setIsEditMemberToggled] =
    useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user.user);

  const teamMembers = useQuery({
    queryKey: ["team-members", page, query, filter],
    queryFn: () => getTeamMembers({ page, page_size, query, filter }),
  });

  const editMember = useMutation({
    mutationKey: ["edit-member"],
    mutationFn: (data: {
      name: string;
      email: string;
      role: string[];
      memberId: string;
    }) => editTeamMember(data),
    onSuccess: () => {
      setMember(null);
      setIsEditMemberToggled(false);
      toast.success("Member details updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["team-members"],
      });
    },
    onError: () => {
      toast.error("Failed to update member details");
    },
  });

  console.log("Helelep");
  console.log(user);

  const handleToggle = () => {
    if (user?.plan.name === "Basic Plan") {
      return dispatch(showModal("invite member"));
    }
    setIsToggled((prev) => !prev);
  };

  const handleEditMemberToggle = () => {
    setIsEditMemberToggled((prev) => !prev);
    setMember(null);
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

  const onEditSubmit = async (values: FormValues) => {
    try {
      setEmail(values.email);
      const inviteeDetails = {
        ...values,
        role: values.role.map((option) => option.value),
      };
      editMember.mutate({ ...inviteeDetails, memberId: member?._id! });
    } catch (err: any) {
      toast.error("Failed to send invite " + err?.data?.message || err.message);
      console.error("Failed to send invite", err);
    }
  };

  const validateForm = (values: FormValues) => {
    return validate(values, constraints) || {};
  };

  useEffect(() => {
    if (member) {
      setIsEditMemberToggled(true);
    }
  }, [member]);

  return (
    <>
      <div className="container px-2 sm:px-4">
        <div className="px-0 lg:px-0">
          <div className="flex my-10 gap-2 sm:gap-6 flex-wrap items-center justify-between">
            <Fade cascade>
              <div className="flex gap-5 items-center">
                <h2 className="text-[#333333] font-normal text-[1.5rem]">
                  Team Members
                </h2>
                <div className="flex justify-center items-center min-w-6 gap-2 bg-border rounded-[8px] border-[1px] bg-[#EAEAEA] size-6 w-fit px-2 text-sm text-[#828282]">
                  {data?.data?.data === undefined ? (
                    <Slide direction="left" className="p-0">
                      <Loader2 className="size-4 animate-spin p-0" />
                    </Slide>
                  ) : (
                    <Slide direction="right">{data?.data?.data.length}</Slide>
                  )}
                </div>
              </div>
            </Fade>
            {teamMembers?.data?.data.length > 1 && (
              <Slide direction="right" duration={500} triggerOnce>
                <Button
                  label={
                    <div className="flex justify-center items-center gap-2">
                      <span className="hidden sm:inline-block">
                        Invite Member
                      </span>{" "}
                      <span className="">
                        <Crown className="text-amber-500 fill-amber-500" />
                      </span>
                      {/* <span className="sm:hidden">
                        <RiMailSendLine />
                      </span> */}
                    </div>
                  }
                  onClick={handleToggle}
                  className="h-10 sm:h-12 min-w-fit sm:min-w-[188px]"
                />
              </Slide>
            )}
          </div>
          {data?.data?.data.length < 1 && <NoTeam />}

          <div className="flex my-10 items-center justify-between w-full">
            <div className="flex gap-2 sm:gap-5 items-center w-full">
              <FilterButton
                text="Filter by"
                icon={<IoFilterOutline />}
                buttonClassName="rounded-full border-[#d9d9d9]"
                setFilter={setFilter}
                onClick={(val: string) => {
                  setFilter(val);
                }}
              />

              <div className="flex flex-1 items-center px-4 gap-2 rounded-[2rem] border-[1px] border-[#d9d9d9] w-full max-w-[420px] h-[40px]">
                <input
                  className="ring-0 text-[#838383] flex-1 outline-none"
                  type="text"
                  placeholder="Search team members by name, email address"
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />
                <Image src={search} alt="Search" width={24} height={24} />
              </div>
            </div>
          </div>

          {teamMembers.isLoading && (
            <div className="mt-10 flex justify-center items-center">
              <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loading />
              </div>
            </div>
          )}

          {teamMembers?.data?.data.length >= 1 && (
            <Slide
              direction="up"
              duration={500}
              triggerOnce
              reverse={teamMembers.isLoading}
            >
              <MembersTable
                members={teamMembers?.data?.data ?? []}
                tableState={memberTableState}
                setMember={setMember}
              />
              <PaginatorButtons
                total={teamMembers?.data?.total ?? 0}
                pageSize={teamMembers?.data?.page_size ?? 0}
                currentPage={teamMembers?.data?.page ?? 1}
                onPageChange={setPage}
              />
              <div className="h-10" />
            </Slide>
          )}
          {teamMembers?.data?.data.length <= 0 && (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="w-75 text-center mt-16">
                <Image
                  src={teamIcon.src}
                  alt="no team icon"
                  width={70}
                  height={70}
                  className="mx-auto"
                />
                <p className="text-2xl font-bold mt-3">No team member found</p>
                <p className="text-[#7A8699] font-normal text-[calc(1rem+2px)]">
                  Your search and filter criteria did not match any team members
                </p>
                <button
                  className="auth-btn mt-5"
                  onClick={() => {
                    setQuery("");
                  }}
                >
                  Reset filter and search
                </button>
              </div>
            </div>
          )}

          {/* Invite member */}
          <Slide direction="up" duration={200}>
            <ModalComponent
              title="Add member"
              titleClassName={"pl-0"}
              openModal={isToggled}
              onClose={handleToggle}
            >
              <Form<FormValues>
                onSubmit={onSubmit}
                validate={validateForm}
                render={({ handleSubmit, form, submitting }) => (
                  <form onSubmit={handleSubmit} className="w-full relative">
                    <Fade duration={1000} cascade damping={0.05} triggerOnce>
                      <Slide
                        direction="up"
                        cascade
                        damping={0.05}
                        className="[animation-fill-mode:backwards] relative"
                        triggerOnce
                      >
                        <Field name="name">
                          {({ input, meta }) => (
                            <Input
                              label="Name"
                              type="text"
                              placeholder="Enter your Name"
                              form={form}
                              className="h-12 z-10"
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
                              className="h-12 z-10"
                              {...input}
                              // error={meta.touched && meta.error}
                            />
                          )}
                        </Field>

                        <div style={{ zIndex: 100 }}>
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
                                className="basic-multi-select z-20"
                                classNamePrefix="role"
                                label={"Role"}
                                customStyles={multiSelectCustomStyles}
                              />
                            )}
                          </Field>
                        </div>
                      </Slide>
                    </Fade>

                    <div
                      style={{ zIndex: 10 }}
                      className="flex gap-5 mt-10 z-10"
                    >
                      <button
                        className="auth-btn w-[1/2] justify-center"
                        type="submit"
                        disabled={submitting || isLoading}
                      >
                        {submitting || isLoading ? (
                          <ClipLoader size={20} className="text-white" />
                        ) : (
                          "Send Invite"
                        )}
                      </button>

                      <button
                        className="text-[#5B03B2] border-none hover:bg-border px-6 rounded-lg"
                        type="button"
                        onClick={() => setIsToggled((prev) => !prev)}
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
          </Slide>

          {/* Edit member */}
          {member && (
            <Slide direction="up" duration={200}>
              <ModalComponent
                title="Edit member"
                titleClassName={"pl-0"}
                openModal={isEditMemberToggled}
                onClose={handleEditMemberToggle}
              >
                <Form<FormValues>
                  onSubmit={onEditSubmit}
                  validate={validateForm}
                  render={({ handleSubmit, form }) => (
                    <form onSubmit={handleSubmit} className="w-full relative">
                      <Fade duration={1000} cascade damping={0.05} triggerOnce>
                        <Slide
                          direction="up"
                          cascade
                          damping={0.05}
                          className="[animation-fill-mode:backwards] relative"
                          triggerOnce
                        >
                          <Field
                            name="name"
                            value={member.name}
                            defaultValue={member.name}
                          >
                            {({ input, meta }) => (
                              <Input
                                label="Name"
                                type="text"
                                placeholder="Enter your Name"
                                form={form}
                                className="h-12 z-10"
                                {...input}
                                // error={meta.touched && meta.error}
                              />
                            )}
                          </Field>

                          <Field
                            name="email"
                            value={member.email}
                            defaultValue={member.email}
                          >
                            {({ input, meta }) => (
                              <Input
                                label="Email"
                                type="text"
                                // disabled
                                placeholder="Enter your Email"
                                form={form}
                                className="h-12 z-10"
                                {...input}
                                // error={meta.touched && meta.error}
                              />
                            )}
                          </Field>

                          <div style={{ zIndex: 100 }}>
                            <Field
                              name="role"
                              value={member.roles[0].role.map((role) => ({
                                label: role,
                                value: role,
                              }))}
                              defaultValue={member.roles[0].role.map(
                                (role) => ({
                                  label: role,
                                  value: role,
                                })
                              )}
                            >
                              {({ input, meta }) => (
                                <MultiSelectField
                                  input={input}
                                  meta={{ ...meta, touched: !!meta.touched }}
                                  options={options}
                                  isMulti
                                  styles={customStyles}
                                  placeholder="Select role"
                                  closeMenuOnSelect={false}
                                  className="basic-multi-select z-20"
                                  classNamePrefix="role"
                                  label={"Role"}
                                  customStyles={multiSelectCustomStyles}
                                />
                              )}
                            </Field>
                          </div>
                        </Slide>
                      </Fade>

                      <div
                        style={{ zIndex: 10 }}
                        className="flex gap-5 mt-10 z-10"
                      >
                        <button
                          className="auth-btn w-[1/2] justify-center"
                          type="submit"
                          disabled={editMember.isPending || isLoading}
                        >
                          {editMember.isPending || isLoading ? (
                            <ClipLoader size={20} className="text-white" />
                          ) : (
                            "Save changes"
                          )}
                        </button>

                        <button
                          className="text-[#5B03B2] border-none hover:bg-border px-6 rounded-lg"
                          type="button"
                          onClick={() =>
                            setIsEditMemberToggled((prev) => !prev)
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                />
              </ModalComponent>
            </Slide>
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
