import { GenericApiResponse, GenericPaginatedResponse } from ".";

interface Media {
  type: string;
  url: string;
}

export interface ITutorial {
  _id: string;
  creator: string;
  type: string;
  title: string;
  description: string;
  content: string;
  media: Media[];
  links: string[];
  is_published: boolean;
  is_deleted: false;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type GetTutorials = GenericPaginatedResponse<ITutorial> &
  GenericApiResponse;

export type GetSingleTutorial = GenericApiResponse & ITutorial;
