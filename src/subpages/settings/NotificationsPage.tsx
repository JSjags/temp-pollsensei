"use client";

import React, { useState } from "react";
import Switch from "../../components/settings/Switch";
import { FaRegCircle, FaRegCheckCircle } from "react-icons/fa";

const NotificationsPage: React.FC = () => {
  const [emailNotification, setEmailNotification] = useState<boolean>(false);
  const [moreActivity, setMoreActivity] = useState<boolean>(false);

  return (
    <div className="px-[2rem] lg:px-[4.4rem] flex flex-col py-[1.5rem] md:py-[3.88rem]">
      <div className="flex flex-col pb-5">
        <h3 className="text-[calc(1rem+4px)] font-bold ">Page</h3>
        <p className="text-[#898989] text-[calc(1rem-2px)]">
          Get notifications on what&apos;s happening right now. You can turn it
          off at any time
        </p>
        <hr className="mt-8" />
      </div>
      <div className="flex justify-between items-center pb-5">
        <div className="flex flex-col">
          <h3 className="text-[calc(1rem+4px)] font-bold ">Email Nofication</h3>
          <p className="text-[#898989] text-[calc(1rem-2px)]">
            PollSensei can send you email notifications for any new direct
            messages
          </p>
        </div>
        <Switch
          isChecked={emailNotification}
          onClick={() => setEmailNotification(!emailNotification)}
        />
      </div>
      <ul>
        <li className="flex items-center gap-2 mb-5">
          <FaRegCheckCircle className="text-2xl text-[#5B03B2]" />
          <div>
            <h4 className="text-sm font-semibold">News and Update settings</h4>
            <p className="text-sm text-[#4F5B67]">
              The latest news about the latest features and software update
              settings on PollSensei
            </p>
          </div>
        </li>
        <li className="flex items-center gap-2 mb-5">
          <FaRegCircle className="text-2xl text-[#4F5B67]" />
          <div>
            <h4 className="text-sm font-semibold">Tips and Tutorials</h4>
            <p className="text-sm text-[#4F5B67]">
              Get notifications on tips and tricks to increase your productivity
              and efficiency
            </p>
          </div>
        </li>
        <li className="flex items-center gap-2 mb-5">
          <FaRegCircle className="text-2xl text-[#4F5B67]" />
          <div>
            <h4 className="text-sm font-semibold">Offers and Promotions</h4>
            <p className="text-sm text-[#4F5B67]">
              Receive notifications on the latest promotion offers, packages and
              discounts
            </p>
          </div>
        </li>
      </ul>
      <hr className="mt-4" />

      <div className="flex justify-between items-center py-5">
        <div className="flex flex-col">
          <h3 className="text-[calc(1rem+4px)] font-bold ">More Activity</h3>
          <p className="text-[#898989] text-[calc(1rem-2px)]">
            PollSensei can send you email notifications for any new direct
            messages
          </p>
        </div>
        <Switch
          isChecked={moreActivity}
          onClick={() => setMoreActivity(!moreActivity)}
        />
      </div>
      <ul>
        <li className="flex items-center gap-2 mb-5">
          <FaRegCheckCircle className="text-2xl text-[#5B03B2]" />
          <div>
            <h4 className="text-sm font-semibold">
              All Reminders and Activities
            </h4>
            <p className="text-sm text-[#4F5B67]">
              Notify me about all recent system activities and reminders
            </p>
          </div>
        </li>
        <li className="flex items-center gap-2 mb-5">
          <FaRegCircle className="text-2xl text-[#4F5B67]" />
          <div>
            <h4 className="text-sm font-semibold">Activities only</h4>
            <p className="text-sm text-[#4F5B67]">
              Only notify me about latest activity updates
            </p>
          </div>
        </li>
        <li className="flex items-center gap-2 mb-5">
          <FaRegCircle className="text-2xl text-[#4F5B67]" />
          <div>
            <h4 className="text-sm font-semibold">Important Reminder Only</h4>
            <p className="text-sm text-[#4F5B67]">
              Only notify me about high priority activities and reminders
            </p>
          </div>
        </li>
      </ul>
      <div>
        <button className="auth-btn">Update Notifications</button>
      </div>
    </div>
  );
};

export default NotificationsPage;
