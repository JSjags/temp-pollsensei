import React, { useState } from "react";
import { formatDate } from "../../lib/helpers";
import { cn, handleAccountStatus } from "@/lib/utils";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/reusable/data-table";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/services/admin";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useGetTeamMembersQuery } from "@/services/team.service";

interface Role {
  _id: string;
  role: string[];
}

export interface Member {
  resetCode: { created: string };
  _id: string;
  name: string;
  email: string;
  roles: {
    organization: string;
    role: string[];
    _id: string;
  }[];
  invited_by: {
    userId: string;
    organization: string;
    _id: string;
  }[];
  organization_ids: string[];
  verificationToken: string;
  isEmailVerified: boolean;
  disabled: {
    organization: string;
    status: boolean;
    _id: string;
  }[];
  status: {
    organization: string;
    status: string;
    _id: string;
  }[];
  joinedDate: {
    organization: string;
    dateJoined: null;
    _id: string;
  }[];
  bios: {
    organization: string;
    bio: string;
    _id: string;
  }[];
  notifications: {
    email_notification: {
      news_and_updates: boolean;
      tips_and_tutorials: boolean;
      offers_and_promotions: boolean;
    };
    more_activity: {
      all_reminders_and_activities: boolean;
      activities_only: boolean;
      important_reminder_only: boolean;
    };
    organization: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MembersTableProps {
  members: Member[];
  tableState: boolean;
  setMember: any;
}

const MembersTable: React.FC<MembersTableProps> = ({
  members,
  tableState,
  setMember,
}) => {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>();

  const { refetch } = useGetTeamMembersQuery({});

  const columns: ColumnDef<Member>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="border-foreground/50 data-[state='unchecked']:bg-transparent data-[state='indeterminate']:bg-transparent data-[state='indeterminate']:text-transparent data-[state='checked']:bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select all"
          className="border-foreground/50 data-[state='unchecked']:bg-transparent data-[state='checked']:bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email Address
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      // cell: ({ row }) => {
      //   return (
      //     <p
      //       className={cn(
      //         "py-1 px-2 rounded capitalize text-center mx-4",
      //         row.original.e === "paid" && "bg-green-500 text-foreground",
      //         row.original.status === "unpaid" && "bg-red-500 text-foreground"
      //       )}
      //     >
      //       {row.original.status}
      //     </p>
      //   );
      // }
    },
    {
      accessorKey: "roles",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => {
              const isSortedAsc = column.getIsSorted() === "asc";
              const isSortedDesc = column.getIsSorted() === "desc";
              if (isSortedAsc) {
                column.toggleSorting(false); // Change to false
              } else if (isSortedDesc) {
                column.toggleSorting(undefined); // Change to undefined
              } else {
                column.toggleSorting(true);
              }
            }}
          >
            Roles
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.roles.map((roleItem) => {
          const rolesToShow = roleItem.role.slice(0, 2);
          const remainingRolesCount = roleItem.role.length - 2;
          return (
            <div key={roleItem._id}>
              {rolesToShow.map((role) => (
                <span
                  className="rounded-full border border-foreground/50 mx-1 px-3"
                  key={role}
                >
                  {role}
                </span>
              ))}
              {remainingRolesCount > 0 && <span>+{remainingRolesCount}</span>}
            </div>
          );
        });
      },
    },
    {
      accessorKey: "Date Added",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Added
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => <p>{formatDate(row.original.createdAt)}</p>,
    },
    {
      accessorKey: "Invoice Status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            {column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <p
          className={cn(
            "rounded-full px-4 py-1 w-fit",
            handleAccountStatus(row.original.status[0].status) === "Active" &&
              "bg-[#E6FBD9] text-[#0F5B1D]",
            handleAccountStatus(row.original.status[0].status) === "Invited" &&
              "bg-[#FFF9CF] text-[#7B5C03]",
            handleAccountStatus(row.original.status[0].status) === "Invited" &&
              "bg-[#FFE8D7] text-[#931222]"
          )}
        >
          {handleAccountStatus(row.original.status[0].status)}
        </p>
      ),
    },
    {
      id: "actions",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="px-0 text-center w-14"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Actions
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return (
          <div className="flex justify-start w-fit">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setMember(
                      members.find((m) => m._id === info.row.original._id!)
                    );
                  }}
                >
                  Edit Member
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentId(info.row.original._id!),
                      setShowDeleteModal(true);
                  }}
                  className="text-red-500"
                >
                  Remove member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const deleteMemberMutation = useMutation({
    mutationKey: ["remove member"],
    mutationFn: (id: string) => removeMember(id),
    onSuccess: () => {
      toast.success("Member removed successfully");
      setShowDeleteModal(false);
      setCurrentId(null);
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["team-members"],
      });
    },
    onError: (error: any) => {
      console.log(error);

      toast.error(
        error?.response?.data?.msg ??
          error?.response?.data?.message ??
          error?.message ??
          "Error encountered while deleting plaza."
      );
    },
  });

  const handleDelete = () => {
    deleteMemberMutation.mutate(currentId!);
  };

  return (
    <div>
      {tableState && (
        <>
          <div className="mt-10">
            <DataTable columns={columns} data={members} />
          </div>

          <AlertDialog open={showDeleteModal}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this member's account and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={deleteMemberMutation.isPending}
                >
                  {deleteMemberMutation.isPending ? (
                    <ClipLoader size={20} className="text-white" />
                  ) : (
                    "Continue"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default MembersTable;
