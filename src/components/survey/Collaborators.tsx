import React from "react";
import NoCollaborator from "../ui/NoCollaborator";
import { useParams } from "next/navigation";
import { useGetCollaboratorsListQuery } from "@/services/survey.service";
import CollaboratorsList from "../ui/CollaboratorsList";

const Collaborators = () => {
  const params = useParams();
  const { data } = useGetCollaboratorsListQuery(params.id);

  return (
    <div>
      {data?.data?.length === 0 && <NoCollaborator />}
      {data?.data?.length > 0 && <CollaboratorsList />}
      {/* <CollaboratorsList /> */}
    </div>
  );
};

export default Collaborators;
