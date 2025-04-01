"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collaboratorsApi } from "@/services/collaborators";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Collaborator {
  _id: string;
  name: string;
  email: string;
  status: "invited" | "active";
  roles: Array<{
    role: string[];
    organization: string;
  }>;
  organization: string;
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  onRemove: (userId: string) => void;
}

const CollaboratorSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-lg border">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  </div>
);

export function CollaboratorsList({ collaborators }: CollaboratorsListProps) {
  const params = useParams();
  const surveyId = params.id as string;
  const queryClient = useQueryClient();

  const { mutate: removeCollaborator, isPending: isRemoving } = useMutation({
    mutationFn: collaboratorsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators", surveyId] });
    },
  });

  return (
    <div className="space-y-4">
      {collaborators.map((collaborator, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          key={collaborator._id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {collaborator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{collaborator.name}</h4>
              <p className="text-sm text-muted-foreground">
                {collaborator.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                collaborator.status === "active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              )}
            >
              {collaborator.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {collaborator.roles[0]?.role.join(", ")}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() =>
                removeCollaborator({
                  survey_id: surveyId,
                  user_id: collaborator._id,
                })
              }
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
