import ArticlesSection from "./components/ArticlesSection";
import VideosSection from "./components/VideosSection";

const KnowledgeBase: React.FC = () => {
  return (
    <div className="px-5 md:px-20 py-6 w-full mx-auto">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-4">
        Knowledge Base &gt; <span className="font-medium">Home</span>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Popular on Articles */}
        <ArticlesSection />

        {/* Popular Video Tutorials */}
        <VideosSection />
      </div>
    </div>
  );
};

export default KnowledgeBase;
