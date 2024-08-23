"use client";

import { useRouter } from "next/navigation";
import Switch from "../../components/settings/Switch";
import { useState } from "react";

const AccountSecurityPage = () => {
  const router = useRouter();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  return (
    <div className="px-[2rem] lg:px-[4.4rem] flex flex-col py-[3.88rem]">
      <div className="lg:flex justify-between items-center pb-5">
        <div className="flex flex-col lg:w-2/3">
          <h3 className="text-[calc(1rem+4px)] font-bold ">Change Password</h3>
          <p className="text-[#898989] text-[1rem]">
            Regularly updating your password helps protect your account from
            unauthorized access and enhances overall security.
          </p>
        </div>
        <button
          className="shadow-md text-sm rounded text-[#898989] px-4 py-2"
          onClick={() => router.push("/settings/account-security/edit")}
        >
          Change Password
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
        <Switch
          isChecked={isTwoFactorEnabled}
          onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
        />
      </div>
    </div>
  );
};

export default AccountSecurityPage;
