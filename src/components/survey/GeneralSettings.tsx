import React, { useState, useEffect } from "react";
import { Field, Form } from "react-final-form";
import Input from "../ui/Input";
import MultiSelectField from "../ui/MultipleSelect";
import { Fade, Slide } from "react-awesome-reveal";
import { multiSelectCustomStyles } from "@/constants/multi-select";
import { validate } from "validate.js";
import { toast } from "react-toastify";
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
  toggle:()=>void;
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
    zIndex: "9999",
  }),
  option : (provided: any)=>({
    ...provided,
    border: "",
    backgroundColor: "#F5FAFF",
    color: "#CC9BFD4D",
    outline: "none",
    padding: "12px 0 12px 1.3rem",
    zIndex: "9999",
  })
};



const FormToggle: React.FC<FormToggleProps> = ({
  label,
  description,
  isPremium = false,
  status,
  toggle,
}) => {

  return (
    <label htmlFor="toggle" className="flex justify-between items-center py-4">
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
              className="data-[state=checked]:bg-purple-500 "
              checked={status}
              onCheckedChange={toggle}
            />
    </label>
  );
};

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { data, isLoading, refetch } = useSurveySettingsQuery(params.id);
  const [editSurveySettings, {isSuccess, isError, error}] = useEditSurveySettingsMutation();

  const [settings, setSettings] = useState({
    title: "",
    language: "",
    region: [],
    region_availability: true,
    collect_email: true,
    collect_name: true,
    allow_edit: true,
    email_notification: true,
  });


  useEffect(() => {
    if (data) {
      setSettings({
        title: data.data?.survey_id?.topic || "",
        language: data.data?.language || "",
        region: data.data?.regional_availability?.regions || [],
        region_availability: data.data?.regional_availability?.status,
        collect_email: data.data?.collect_email_addresses || true,
        collect_name: data.data?.collect_name_of_respondents || true,
        allow_edit: data.data?.allow_survey_edit || true,
        email_notification: data.data?.receive_email_notification || true,
      });
    }
  }, [data]);

  const validateForm = (values: any) => {
    return validate(values, {
      title: { presence: true },
      language: { presence: true },
      region: { presence: true },
    }) || {};
  };

  const onSubmit = async (values: any) => {
   
    const editData = {
      language: settings.language,
      availabile_regions: settings.region,
      collect_email_addresses: settings.collect_email,
      collect_name_of_respondents: settings.collect_name,
      allow_survey_edit: settings.allow_edit,
      receive_email_notification: settings.email_notification
  }
  console.log(editData);
    try {
      await editSurveySettings(editData);

    } catch (err: any) {
      toast.error("Failed: " + err.message);
    }
  };

  useEffect(()=>{
    if(isSuccess){
      toast.success("Settings updated successfully");
      refetch()
    }
    if(isError || error){
      toast.error("Failed to update settings: " );
      console.log(error);
    }
  }, [isSuccess, isError, error]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 mt-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <Form
        onSubmit={onSubmit}
        validate={validateForm}
        initialValues={settings}
        render={({ handleSubmit, form, submitting }) => (
          <form onSubmit={handleSubmit} className="w-full relative">
            <Slide direction="up" cascade damping={0.05} className="[animation-fill-mode:backwards] relative" triggerOnce>
              <Field name="title">
                {({ input, meta }) => (
                  <Input
                    label="Survey title"
                    type="text"
                    placeholder="Enter Survey Title"
                    {...input}
                    className="h-12 z-10"
                    form={form}
                  />
                )}
              </Field>

              <Field name="language">
                {({ input, meta }) => (
                  <Input
                    label="Language"
                    type="text"
                    placeholder="Enter Language"
                    {...input}
                    className="h-12 z-10"
                    form={form}
                  />
                )}
              </Field>

              <div style={{ zIndex: 100 }}>
                <Field name="region">
                  {({ input, meta }) => (
                    <MultiSelectField
                      input={input}
                      meta={{ ...meta, touched: !!meta.touched }}
                      options={[
                        { value: "Africa", label: "Africa" },
                        { value: "Asia", label: "Asia" },
                        { value: "Europe", label: "Europe" },
                        { value: "Americas", label: "Americas" },
                        { value: "Oceania", label: "Oceania" },
                        { value: "Antarctica", label: "Antarctica" },
                      ]}
                      isMulti
                      // styles={customStyles}
                      styles={multiSelectCustomStyles}
                      placeholder="Choose region"
                      closeMenuOnSelect={false}
                      className="basic-multi-select z-50"
                      classNamePrefix="role"
                      label="Region"
                    />
                  )}
                </Field>
              </div>

              {/* Other fields */}
              <FormToggle
                label="Regional Availability"
                description="Limit survey responses to participants from designated geographic areas"
                isPremium={true}
                status={settings.region_availability}
                toggle={() => setSettings({...settings, region_availability:settings.region_availability })}
              />
              <FormToggle
                label="Collect email addresses"
                description="We will collect email addresses of respondents."
                status={settings.collect_email}
                toggle={()=> setSettings({...settings, collect_email:!settings.collect_email })}
              />
              <FormToggle
                label="Collect names of respondents"
                description="We will collect names of respondents."
                status={settings.collect_name}
                toggle={()=> setSettings({...settings, collect_name:!settings.collect_name})}
              />
              <FormToggle
                label="Allow survey edit"
                description="Respondents can edit their responses after submission."
                status={settings.allow_edit}
                toggle={()=> setSettings({...settings, allow_edit:!settings.allow_edit})}
              />
              <FormToggle
                label="Receive email notifications"
                description="Receive email notifications when your survey is filled."
                status={settings.email_notification}
                toggle={()=> setSettings({...settings, email_notification:!settings.email_notification})}
              />

              <div className="flex justify-between gap-4 mt-6">
                <button className="bg-gray-200 flex-1 w-full text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300" onClick={() => dispatch(closeSurveySettings())}>
                  Cancel
                </button>
                <button className="bg-purple-600 flex-1 w-full auth-btn text-white px-6 py-2 rounded-md hover:bg-purple-700" type="submit">
                  Save
                </button>
              </div>
            </Slide>
          </form>
        )}
      />
    </div>
  );
};

export default GeneralSettings;

