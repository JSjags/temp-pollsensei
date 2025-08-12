import React, { ReactNode, useState } from "react";
import { Input } from "@/components/ui/shadcn-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStripeConnectAccount } from "@/lib/stripe-connect";
import { toast } from "react-toastify";

type StripeDialogProps = {
  children: ReactNode;
};

export default function StripeDialog({ children }: StripeDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ssn, setSSN] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [error, setError] = useState("");
  const { mutate: connectStripeAccount, isPending } = useStripeConnectAccount();
  const [redirecting, setRedirecting] = useState(false);

  const personalFields = [
    { label: "First Name", value: firstName, setValue: setFirstName },
    { label: "Last Name", value: lastName, setValue: setLastName },
    // { label: "SSN Last 4 Digits", value: ssn, setValue: setSSN },
    { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber },
  ];

  const bankFields = [
    {
      label: "Account Number",
      value: accountNumber,
      setValue: setAccountNumber,
    },
    {
      label: "Account Holder Name",
      value: holderName,
      setValue: setHolderName,
    },
    // {
    //   label: "Routing Number",
    //   value: routingNumber,
    //   setValue: setRoutingNumber,
    // },
    { label: "Sort Code", value: sortCode, setValue: setSortCode },
  ];

  const isFormValid = () => {
    const required = [
      ...personalFields,
      ...bankFields,
      { label: "Address Line 1", value: addressLine1 },
      { label: "City", value: city },
      { label: "State", value: state },
      { label: "Postal Code", value: postalCode },
      { label: "DOB Day", value: dobDay },
      { label: "DOB Month", value: dobMonth },
      { label: "DOB Year", value: dobYear },
    ];
    return required.every((f) => f.value.trim() !== "");
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const payload: any = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      country: "GB",
      account_number: accountNumber,
      account_holder_name: holderName,
      business_url: "https://oaksintelligence.co/",
      mcc: "5734",
      statement_descriptor: "Your Business Name",
      address: {
        line1: addressLine1,
        city,
        state,
        postalCode,
      },
      date_of_birth: {
        day: Number(dobDay),
        month: Number(dobMonth),
        year: Number(dobYear),
      },
    };

    if (ssn.trim()) payload.ssnLast4 = ssn;
    if (sortCode.trim()) payload.sort_code = sortCode;
    if (routingNumber.trim()) payload.routing_number = routingNumber;

    connectStripeAccount(payload, {
      onSuccess: (response: any) => {
        const url = response?.account_setup_url;

        if (url) {
          toast.success("Redirecting to Stripe Dashboard...");
          setRedirecting(true);
          window.location.href = url;
        } else {
          toast.success("Stripe account connected successfully!");
        }
      },
      onError: (err: any) => toast.error(err.message || "Submission failed"),
    });
  };

  const renderInputFields = (
    fields: { label: string; value: string; setValue: (val: string) => void }[],
    columns = 2
  ) => {
    const rows = [];
    for (let i = 0; i < fields.length; i += columns) {
      const row = fields.slice(i, i + columns);
      rows.push(
        <div className="flex items-center gap-4 w-full" key={i}>
          {row.map((field) => (
            <InputField
              key={field.label}
              label={field.label}
              value={field.value}
              setValue={field.setValue}
            />
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[1000000000]"
        className="z-[10000000000000000] max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Connect Stripe Account</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          {renderInputFields(personalFields)}
          {renderInputFields(bankFields)}

          <div className="w-full">
            <label className="text-sm">Address</label>
            <Input
              placeholder="Line 1"
              className="mt-1 h-10"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
            <div className="flex items-center gap-4 mt-4">
              <Input
                placeholder="City"
                className="h-10 w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                placeholder="State"
                className="h-10 w-full"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <Input
                placeholder="Post Code"
                className="h-10 w-full"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-sm">Date of Birth</label>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Day"
                className="h-10 w-full"
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value)}
              />
              <Input
                placeholder="Month"
                className="h-10 w-full"
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value)}
              />
              <Input
                placeholder="Year"
                className="h-10 w-full"
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            variant="gradient"
            disabled={!isFormValid() || isPending || redirecting}
            onClick={handleSubmit}
            className="rounded-md"
          >
            {redirecting
              ? "Redirecting..."
              : isPending
              ? "Connecting..."
              : "Connect Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  setValue: (val: string) => void;
};

function InputField({ label, value, setValue }: InputFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <Input
        id={id}
        name={id}
        placeholder={`Enter ${label}`}
        className="mt-1 h-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
