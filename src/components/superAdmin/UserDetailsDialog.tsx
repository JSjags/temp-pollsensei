import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateInitials } from "@/lib/utils";

const statusColorMap = [
  "#FFC107",
  "#3498DB",
  "#27AE60",
  "#2980B9",
  "#2ECC71",
  "#E74C3C",
  "#FF5733",
];

export interface UserDetailsProps {
  user: any;
  isOpen: boolean;
}

const UserDetailsDialog = ({ user }: UserDetailsProps) => {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === "")
      return "Not available";

    if (key === "createdAt" || key === "updatedAt") {
      return formatDate(value);
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
      if (key === "roles") {
        return value[0]?.role?.join(", ") || "No roles";
      }
      if (key === "status") {
        return value[0]?.status || "Not available";
      }
      if (key === "bios") {
        return value[0]?.bio || "No bio";
      }
      if (value.length === 0) return "None";
      return value.join(", ");
    }

    if (typeof value === "object") {
      if (key === "survey_statistics") {
        return `Total: ${value.total_survey}, AI: ${value.ai_survey}, Manual: ${value.manual_survey}`;
      }
      return JSON.stringify(value);
    }

    return value;
  };

  const displayFields = [
    "name",
    "email",
    "country",
    "account_type",
    "roles",
    "status",
    "bios",
    "isEmailVerified",
    "test_user",
    "referral_code",
    "visit_count",
    "survey_statistics",
    "createdAt",
    "updatedAt",
  ];

  return (
    <DialogContent
      className="max-w-2xl z-[100000]"
      overlayClassName="z-[100000]"
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={user?.photo_url ?? ""} alt={user?.name} />
            <AvatarFallback
              className="font-semibold text-white"
              style={{ backgroundColor: statusColorMap[0] }}
            >
              {generateInitials(user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh] mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayFields.map((key) => (
            <div key={key} className="space-y-1.5">
              <h3 className="text-sm font-medium capitalize text-gray-500">
                {key.replace(/_/g, " ")}
              </h3>
              <p className="text-sm">{renderValue(key, user[key])}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default UserDetailsDialog;
