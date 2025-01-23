export type MediaType = "video" | "article" | "both";
export type ContentType =
  | "All resources"
  | "Video tutorials"
  | "Web Articles"
  | "Text tutorials";

export interface LearningResource {
  id: string;
  title: string;
  mediaType: MediaType;
  contentType: ContentType[];
  duration: string;
  videoUrl?: string;
  articleUrl?: string;
}

export const learningResources: LearningResource[] = [
  {
    id: "1",
    title: "How to create a survey",
    mediaType: "video",
    contentType: ["All resources", "Video tutorials"],
    duration: "5 min",
    videoUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Survey design best practices",
    mediaType: "article",
    contentType: ["All resources", "Web Articles"],
    duration: "7 min read",
    articleUrl: "#",
  },
  {
    id: "3",
    title: "Advanced question types",
    mediaType: "both",
    contentType: ["All resources", "Video tutorials", "Web Articles"],
    duration: "10 min",
    videoUrl: "/placeholder.svg?height=200&width=400",
    articleUrl: "#",
  },
  {
    id: "4",
    title: "Analyzing survey results",
    mediaType: "video",
    contentType: ["All resources", "Video tutorials"],
    duration: "8 min",
    videoUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "5",
    title: "Increasing survey response rates",
    mediaType: "article",
    contentType: ["All resources", "Web Articles"],
    duration: "6 min read",
    articleUrl: "#",
  },
  {
    id: "6",
    title: "Creating multilingual surveys",
    mediaType: "both",
    contentType: ["All resources", "Video tutorials", "Web Articles"],
    duration: "12 min",
    videoUrl: "/placeholder.svg?height=200&width=400",
    articleUrl: "#",
  },
];
