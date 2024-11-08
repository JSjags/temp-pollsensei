"use client";

import { useRouter } from "next/navigation";
// import Switch from "../../components/settings/Switch";
import { useEffect, useState } from "react";
import ModalComponent from "@/components/ui/ModalComponent";
import { ClipLoader } from "react-spinners";
import ValidatePwdIcon from "../auth/ValidatePwdIcon";
import { FaTimesCircle } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import PasswordField from "@/components/ui/PasswordField";
import { Form, Field } from "react-final-form";
import validate from "validate.js";
import { toast } from "react-toastify";
import { useLazyChangePswdCodeQuery, useResetPasswordMutation, useUpdateUserPasswordMutation } from "@/services/user.service";
import { Switch } from "@/components/ui/switch";
import Input from "@/components/ui/Input";

const newPswdConstraints = {
  newPassword: {
    presence: true,
    length: {
      minimum: 8,
    },
    format: {
      pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      message:
        "^Password must be between 8 and 20 characters long, n/ contain at least one uppercase letter, one number, n/ and one special character",
    },
  },
  confirmPassword: {
    presence: true,
    equality: {
      attribute: "newPassword",
      message: "^Passwords do not match",
    },
  },
  currentPassword: {
    presence: true,
    // email: true,
  },
  code: {
    presence: true,
    length: {
      is: 4,
    },
  },
};

const AccountSecurityPage = () => {
  const router = useRouter();
  // const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [changePswdModal, setChangePswdModal] = useState(false);
  const [updateUserPassword, { isLoading: isReset, data }] = useUpdateUserPasswordMutation();
  // const [createNewPswd, setCreateNewPswd] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [changePswdCode, {data:passwordData, isLoading, isSuccess }] = useLazyChangePswdCodeQuery()


  const [eyeState, setEyeState] = useState({
    password: false,
    confirmPassword: false,
  });

  const [pwdFocus, setPwdFocus] = useState(false);
  const [validPwd] = useState(false);

  const [matchFocus, setMatchFocus] = useState(false);

  const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const toggleEye = (field: "password" | "confirmPassword") => {
    setEyeState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const GetPswdResetCode = async()=>{
    try{
     changePswdCode(null)
    }catch(err: any){
      toast.error(err.message || err?.data?.message);
    //  setChangePswdModal((prev)=>!prev)
     console.log(err)

    };
  }

  useEffect(()=>{

    if(isSuccess){
      toast.success(passwordData?.message || "Check email for password code change")
      setChangePswdModal((prev)=>!prev)
      console.log(passwordData)
    }

  }, [isSuccess])

  const createNewPswdHandler = async (values: {
    newPassword: string;
    confirmPassword: string;
    code: string;
    currentPassword:string;
  }) => {
    try {
      const reset_data = { ...values, };
      console.log(reset_data);
      await updateUserPassword(reset_data).unwrap();
      toast.success("Password reset was successful");
      console.log(data);
      setChangePswdModal((prev)=>!prev)
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
      setChangePswdModal((prev)=>!prev)
      setErrorMessage(err?.data?.message || err.message)
      console.error("Failed ", err?.data?.message || err.message);
    }
  };

  const validateFormPswdForm = (values: any) => {
    return validate(values, newPswdConstraints) || {};
  };


  return (
    <div className="px-[2rem] lg:px-[4.4rem] flex flex-col py-[3.88rem]">
      <div className="lg:flex justify-between items-center pb-5">
        <div className="flex flex-col lg:w-2/3">
          <h3 className="text-[calc(1rem+4px)] font-bold ">Change Password
          </h3>
          <p className="text-[#898989] text-[1rem]">
            Regularly updating your password helps protect your account from
            unauthorized access and enhances overall security.
          </p>
        </div>
        <button
          className="shadow-md text-sm rounded text-[#898989] px-4 py-2"
          onClick={GetPswdResetCode}
        >
          {isLoading ? "Waiting" : "Change Password"}
        </button>
      </div>
      <div className="lg:flex justify-between items-center">
        <div className="flex flex-col lg:w-2/3">
          <h3 className="text-[calc(1rem+4px)] font-bold ">
            Two-Factor Authentication
          </h3>
          <p className="text-[#898989] text-[1rem]">
            Regularly updating your password helps protect your account from
            unauthorized access and enhances overall security.
          </p>
        </div>
        {/* <Switch
          isChecked={isTwoFactorEnabled}
          onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
        /> */}
          <Switch checked={true} 
            onCheckedChange={()=>toast.success("Feature coming soon!")}
           className="bg-[#9D50BB] " />
      </div>
      <ModalComponent openModal={changePswdModal} onClose={()=>setChangePswdModal((prev)=>!prev)}>
      <div className="flex justify-center flex-col max-w-[516px] w-full">
            <div className="flex-col flex pb-8">
              <h2 className="text-xl font-sans">Change password</h2>
            </div>

            {
              errorMessage && <span className="text-red-500">{errorMessage}</span>
            }

            <Form
              onSubmit={createNewPswdHandler}
              validate={validateFormPswdForm}
              render={({ handleSubmit, form, submitting, values }) => (
                <form onSubmit={handleSubmit}>
                      <Field name="code">
                    {({ input, meta }) => (
                      <Input
                        label="Code sent to your email"
                        type="text"
                        placeholder="Enter the code sent to your email"
                        form={form}
                        {...input}
                      />
                    )}
                  </Field>
                      <Field name="currentPassword">
                    {({ input, meta }) => (
                      <Input
                        label="Current Password"
                        type="text"
                        placeholder="Enter your current password"
                        form={form}
                        {...input}
                      />
                    )}
                  </Field>
                  <Field name="newPassword">
                    {({ input, meta }) => (
                      <PasswordField
                        id="newPassword"
                        eyeState={eyeState.password}
                        toggleEye={() => toggleEye("password")}
                        placeholder="*******"
                        label="Password"
                        form={form as any}
                        {...input}
                        onFocus={() => {
                          input.onFocus();
                          setPwdFocus(true);
                        }}
                        onBlur={() => {
                          input.onBlur();
                          setPwdFocus(false);
                        }}
                        eye={
                          <small className="icon-container">
                            {!meta.active && !pattern.test(input.value) ? (
                              ""
                            ) : pattern.test(input.value) ? (
                              <IoCheckmarkCircle
                                className="text-green-600"
                                size={20}
                              />
                            ) : (
                              <FaTimesCircle
                                className="text-red-600"
                                size={20}
                              />
                            )}
                          </small>
                        }
                      />
                    )}
                  </Field>

                  <Field name="confirmPassword">
                    {({ input, meta }) => (
                      <PasswordField
                        id="confirmPassword"
                        eyeState={eyeState.confirmPassword}
                        toggleEye={() => toggleEye("confirmPassword")}
                        placeholder="*******"
                        label="Confirm Password"
                        form={form as any}
                        {...input}
                        onFocus={() => {
                          input.onFocus();
                          setMatchFocus(true);
                        }}
                        onBlur={() => {
                          input.onBlur();
                          setMatchFocus(false);
                        }}
                        eye={
                          <small className="icon-container">
                            {!meta.active ? (
                              ""
                            ) : input.value === values.newPassword ? (
                              <IoCheckmarkCircle
                                className="text-green-600"
                                size={20}
                              />
                            ) : (
                              <FaTimesCircle
                                className="text-red-600"
                                size={20}
                              />
                            )}
                          </small>
                        }
                      />
                    )}
                  </Field>

                  <div
                    id="pwdnote"
                    className={
                      pwdFocus && !validPwd ? "instructions" : "offscreen"
                    }
                  >
                    <h5 className="text-[#979DA3] ">
                      YOUR PASSWORD MUST CONTAIN
                    </h5>
                    <ul className="text-[#979DA3] mt-3">
                      <li className="flex mb-3 items-center gap-2">
                        <ValidatePwdIcon
                          color={
                            values.newPassword?.length >= 8
                              ? "#2ECC71"
                              : "#E66767"
                          }
                        />
                        Between 8 and 20 characters
                      </li>
                      <li className="flex mb-3 items-center gap-2">
                        <ValidatePwdIcon
                          color={
                            /[A-Z]/.test(values.newPassword)
                              ? "#2ECC71"
                              : "#E66767"
                          }
                        />
                        1 upper case letter
                      </li>
                      <li className="flex mb-3 items-center gap-2">
                        <ValidatePwdIcon
                          color={
                            /\d/.test(values.newPassword)
                              ? "#2ECC71"
                              : "#E66767"
                          }
                        />
                        1 or more numbers
                      </li>
                      <li className="flex mb-3 items-center gap-2">
                        <ValidatePwdIcon
                          color={
                            /[@#&$!]/.test(values.newPassword)
                              ? "#2ECC71"
                              : "#E66767"
                          }
                        />
                        1 or more special characters
                      </li>
                    </ul>
                  </div>

                  <button
                    className="auth-btn w-full mt-3 justify-center"
                    type="submit"
                    disabled={submitting || isReset}
                  >
                    {submitting ? (
                      <ClipLoader size={20} />
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
              )}
            />
          </div>
      </ModalComponent>
    </div>
  );
};

export default AccountSecurityPage;
