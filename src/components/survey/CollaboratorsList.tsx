"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Trash2, Eye, Search, Users2 } from "lucide-react";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { collaboratorsApi } from "@/services/collaborators";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/shadcn-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Collaborator,
  CollaboratorDetailsDialog,
} from "./CollaboratorDetailsDialog";
import { RemoveCollaboratorDialog } from "@/components/survey/RemoveCollaboratorDialog";

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  onRemove: (userId: string) => void;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}

const CollaboratorSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4 sm:gap-3">
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
      <div className="space-y-2 w-full sm:w-auto">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  </div>
);

export function CollaboratorsList({
  collaborators,
  refetch,
}: CollaboratorsListProps) {
  const params = useParams();
  const surveyId = params.id as string;
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<Collaborator | null>(null);
  const [collaboratorToRemove, setCollaboratorToRemove] =
    useState<Collaborator | null>(null);

  const { mutate: removeCollaborator, isPending: isRemoving } = useMutation({
    mutationFn: collaboratorsApi.remove,
    onSuccess: () => {
      refetch();
      toast.success("Collaborator removed successfully");
      setCollaboratorToRemove(null);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove collaborator"
      );
    },
  });

  const handleRemove = (collaborator: Collaborator) => {
    removeCollaborator({
      survey_id: surveyId,
      user_id: collaborator._id,
    });
  };

  const filteredCollaborators = collaborators.filter(
    (collaborator) =>
      collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.collaborator_roles[0]?.role
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Users2 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            Collaborators ({collaborators.length})
          </h2>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collaborators..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Collaborators List */}
      <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2 rounded-lg">
        {/* Table Header */}
        <div className="hidden sm:grid sm:grid-cols-[2fr,1fr,60px] items-center px-4 py-2 text-sm font-medium text-muted-foreground border-b">
          <div>Name</div>
          <div>Status & Roles</div>
          <div className="text-center">Actions</div>
        </div>

        {filteredCollaborators.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No collaborators found
          </div>
        ) : (
          filteredCollaborators.map((collaborator, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={collaborator._id}
              className="group grid grid-cols-1 sm:grid-cols-[2fr,1fr,60px] items-start sm:items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              {/* Name and Email Section */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="text-sm">
                    {collaborator.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium truncate leading-none mb-1.5">
                    {collaborator.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {collaborator.email}
                  </p>
                </div>
              </div>

              {/* Status and Roles Section */}
              <div className="flex flex-col gap-2 py-2 sm:py-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "w-fit capitalize whitespace-nowrap",
                    collaborator.status[0]?.status === "Active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  )}
                >
                  {collaborator.status[0]?.status || "unknown"}
                </Badge>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {collaborator.collaborator_roles[0]?.role.join(", ") ||
                    "No roles"}
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex justify-end sm:justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-muted"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => setSelectedCollaborator(collaborator)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setCollaboratorToRemove(collaborator)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <CollaboratorDetailsDialog
        collaborator={selectedCollaborator}
        open={!!selectedCollaborator}
        onOpenChange={(open) => !open && setSelectedCollaborator(null)}
      />

      <RemoveCollaboratorDialog
        collaborator={collaboratorToRemove}
        open={!!collaboratorToRemove}
        onOpenChange={(open) => !open && setCollaboratorToRemove(null)}
        onConfirm={() =>
          collaboratorToRemove && handleRemove(collaboratorToRemove)
        }
        isLoading={isRemoving}
      />
    </div>
  );
}
