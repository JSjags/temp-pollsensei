import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import Input from "../ui/Input";
import MultiSelectField from "../ui/MultipleSelect";
import { Fade, Slide } from "react-awesome-reveal";
import { multiSelectCustomStyles } from "@/constants/multi-select";
import { validate } from "validate.js";
import { toast } from "react-toastify";
import { Languages } from "lucide-react";
import { Switch } from "../ui/switch";
import { useEditSurveySettingsMutation, useSurveySettingsQuery } from "@/services/survey.service";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { closeSurveySettings } from "@/redux/slices/survey_settings.slice";

interface FormToggleProps {
  label: string;
  description: string;
  isPremium?: boolean;
  status?: boolean;
}

interface FormValues {
  name: string;
  email: string;
  role: Array<{ value: string; label: string }>;
}

const constraints = {
  title: {
    presence: true,
  },
  languages: {
    presence: true,
    // email: true,
  },
  region: {
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

const FormToggle: React.FC<FormToggleProps> = ({
  label,
  description,
  isPremium = false,
  status,
}) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <h3 className="text-gray-800 font-semibold">
          {label}
          {isPremium && (
            <span className="text-purple-500 ml-2 font-bold text-sm">
              PREMIUM ⭐
            </span>
          )}
        </h3>
        <p className="text-gray-500 w-3/4 text-sm">{description}</p>
      </div>
        <Switch
              className="data-[state=checked]:bg-purple-500"
              checked={status}
              onCheckedChange={()=>setEnabled(!enabled)}
            />
    </div>
  );
};

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const validateForm = (values: FormValues) => {
    return validate(values, constraints) || {};
  };
  const { data, } = useSurveySettingsQuery(params.id)
  const [editSurveySettings, { }] = useEditSurveySettingsMutation({
    
  })
  console.log(data);

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Invitation sent");
    } catch (err: any) {
      toast.error("Failed " + err?.data?.message || err.message);
      console.error("Failed to send invite", err);
    }
  };

  const options = [
  { value: "Africa", label: "Africa" },
  { value: "Asia", label: "Asia" },
  { value: "Europe", label: "Europe" },
  { value: "Americas", label: "Americas" },
  { value: "Oceania", label: "Oceania" },
  { value: "Antarctica", label: "Antarctica" },
  ]

  return (
    <div className="bg-white p-6 mt-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <Form<FormValues>
        onSubmit={onSubmit}
        validate={validateForm}
        render={({ handleSubmit, form, submitting }) => (
          <form onSubmit={handleSubmit} className="w-full relative">
            {/* <Fade duration={1000} cascade damping={0.05} triggerOnce> */}
              <Slide
                direction="up"
                cascade
                damping={0.05}
                className="[animation-fill-mode:backwards] relative"
                triggerOnce
              >
                <Field name="title"  initialValue={data?.data?.survey_id?.topic}>
                  {({ input, meta }) => (
                    <Input
                      label="Survey title"
                      type="text"
                      defaultValue={data?.data?.survey_id?.topic}
                      placeholder="Enter your Name"
                      form={form}
                      className="h-12 z-10"
                      {...input}
                      // error={meta.touched && meta.error}
                    />
                  )}
                </Field>

                <Field name="language" initialValue={data?.data?.language}>
                  {({ input, meta }) => (
                    <Input
                      label="Language"
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
                  <Field name="region">
                    {({ input, meta }) => (
                      <MultiSelectField
                        input={input}
                        meta={{ ...meta, touched: !!meta.touched }}
                        options={options}
                        isMulti
                        styles={customStyles}
                        placeholder="Choose region"
                        closeMenuOnSelect={false}
                        className="basic-multi-select z-20"
                        classNamePrefix="role"
                        label={"Region"}
                        customStyles={multiSelectCustomStyles}
                        // defaultValue={[options[0].label, options[1].label]}
                      />
                    )}
                  </Field>
                </div>
       

            <FormToggle
              label="Regional Availability"
              description="Get localized insights. Limit survey responses to participants from designated geographic areas"
              isPremium={true}
              status={data?.data?.regional_availability?.status}
              
            />
            <FormToggle
              label="Collect email addresses"
              description="We will collect email addresses of respondents when they are about to fill your survey."
              status={data?.data?.collect_email_addresses}
            />
            <FormToggle
              label="Collect names of respondents"
              description="We will collect names of respondents when they are about to fill your survey."
              status={data?.data?.collect_name_of_respondents}
            />
            <FormToggle
              label="Allow survey edit"
              description="Respondents can edit their responses after they have filled the survey. Note that users have a 30 minutes window to edit responses."
              status={data?.data?.allow_survey_edit}
            
            />
            <FormToggle
              label="Receive email notifications"
              description="Receive email notifications when your survey is filled."
              status={data?.data?.receive_email_notification}
            />

            {/* Buttons */}
            <div className="flex justify-between gap-4 mt-6">
              <button className="bg-gray-200 flex-1 w-full text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
              onClick={()=>{ dispatch(closeSurveySettings()) }}
              
              >
                Cancel
              </button>
              <button className="bg-purple-600 flex-1 w-full auth-btn text-white px-6 py-2 rounded-md hover:bg-purple-700">
                Save
              </button>
            </div>
            </Slide>
            {/* </Fade> */}
          </form>
        )}
      />
    </div>
  );
};

export default GeneralSettings;
