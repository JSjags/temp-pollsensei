import { closeForm, openForm } from "@/redux/slices/form.slice";
import { useGetCollaboratorsListQuery, useInviteCollaboratorMutation } from "@/services/survey.service";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ModalComponent from "./ModalComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Input from "./Input";
import MultiSelectField from "./MultipleSelect";
import InviteSuccess from "./InviteSuccess";

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


const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Invited":
      return "bg-yellow-100 text-yellow-600";
    case "Active":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const CollaboratorsList: React.FC = () => {
  const dispatch = useDispatch();
  const survey_id = useParams();
  const [email, setEmail] = useState<string>("");
  const [inviteSucc, setInviteSucc] = useState<boolean>(false);
  const [inviteCollaborator, { isSuccess, isError, error, isLoading }] =
  useInviteCollaboratorMutation();
  const { refetch } = useGetCollaboratorsListQuery(survey_id.id);
  const formModal = useSelector((state: RootState) => state.form.isFormOpen);
  const { data } = useGetCollaboratorsListQuery(survey_id.id);
  console.log(data);

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
    <div className="bg-white p-6 rounded-lg shadow-md  mx-auto">
      {data?.data?.map((user:any, index:number) => (
        <div key={index} className="flex items-center justify-between mb-4">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <img
              src={user?.photo_url}
              alt={user?.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-gray-800 font-semibold">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Status Badge and Roles */}
          <div className="flex justify-between items-center space-x-4">
            <span
              className={`px-3 py-1 flex- rounded-full text-sm font-semibold ${getStatusBadgeColor(
                user?.status[0]?.status
              )}`}
            >
              {user?.status[0]?.status}
            </span>

            {/* Display Multiple Roles */}
            <div className="flex space-x-2 flex-">
              {user?.collaborator_roles[0]?.role?.map((role:any, idx:number) => (
                <span
                  key={idx}
                  className=" border-gray-400 text-gray-600 px-4 py-1 rounded- rounded-full border-2  mx-1  text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Invite Button */}
      <div className="flex justify-end">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          onClick={() => dispatch(openForm())}
        >
          Send Invite
        </button>
      </div>



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

export default CollaboratorsList;


const options = [
  { value: "Data Collector", label: "Data Collector" },
  { value: "Data Validator", label: "Data Validator" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Data Editor", label: "Data Editor" },
];