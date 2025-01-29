import { Metadata } from "next";
import ArticleDetailsPage from "./ArticleDetailsPage";
import { ITutorial } from "@/types/api/tutorials.types";

const webAppBaseURL =
  process.env.VITE_NEXT_PUBLIC_DOMAIN || "https://pollsensei.ai";
interface Props {
  params: {
    id: string;
  };
}

async function fetchSingleTutorial(slug: string) {
  const res = await fetch(
    `https://pollsensei-api-a0e832048911.herokuapp.com/api/v1/tutorial/${slug}`
    // {
    //   cache: "no-cache",
    // }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res?.json();

  return data?.data as ITutorial;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const blog = await fetchSingleTutorial(id);

  if (!blog) {
    return {
      title: "Article Not Found",
      description: "Article you are looking for does not exist.",
    };
  }

  const articleImage = blog?.media?.[0]?.url || `${webAppBaseURL}/favicon.ico`;
  const description = blog?.description || "Read more about this post.";

  return {
    title: blog?.title,
    description,
    openGraph: {
      title: blog?.title,
      description,
      url: `${webAppBaseURL}/resource-hub/articles/${blog?.slug}`,
      images: [
        {
          url: articleImage,
          alt: blog?.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog?.title,
      description,
      images: [articleImage],
    },
  };
}

const ArticleDetails: React.FC = () => {
  return <ArticleDetailsPage />;
};

export default ArticleDetails;
