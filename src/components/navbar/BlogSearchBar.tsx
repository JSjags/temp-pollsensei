"use client";
import React, { FC, useState, useEffect, useCallback } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { MdArticle, MdDateRange, MdPerson } from "react-icons/md";
import { Input } from "@/components/ui/shadcn-input";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { GetSearchResults } from "@/services/api/apiRequest";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  published_date: string;
  slug: string;
}

interface BlogSearchBarProps {
  placeholder?: string;
  className?: string;
}

const BlogSearchBar: FC<BlogSearchBarProps> = ({
  placeholder = "Search reports...",
  className = "",
}) => {
  const router = useRouter();

  // Internal state management
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: [APP_KEYS.SEARCH_RESULTS, debouncedSearchTerm],
    queryFn: () =>
      GetSearchResults({
        search_term: debouncedSearchTerm,
        page: 1,
        page_size: 10,
      }),
    enabled: debouncedSearchTerm.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  // console.log({ searchResults });

  useEffect(() => {
    setShowResults(searchTerm.length >= 2);
  }, [searchTerm]);

  const handleResultClick = useCallback(
    (slug: string) => {
      router.push(`/blog/${slug}`);
      setShowResults(false);
      setSearchTerm("");
    },
    [router]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`relative w-full max-w-[300px] ${className}`}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          onBlur={() => {
            setTimeout(() => setShowResults(false), 200);
          }}
        />
        {isLoading && (
          <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && debouncedSearchTerm.length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              <FaSpinner className="animate-spin mx-auto mb-2" />
              Searching...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-500">
              Error searching reports. Please try again.
            </div>
          )}

          {debouncedSearchTerm.length >= 2 &&
            searchResults &&
            searchResults.data.length === 0 &&
            !isLoading && (
              <div className="p-4 text-center text-gray-500">
                No reports found for {debouncedSearchTerm}
              </div>
            )}

          {searchResults && searchResults.total > 0 && (
            <>
              <div className="z-[500] max-h-80 overflow-y-auto">
                {searchResults.data.map((result: SearchResult) => (
                  <div
                    key={result.id}
                    onMouseDown={() => handleResultClick(result.slug)} // Use onMouseDown to prevent blur
                    className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors duration-150 group"
                  >
                    <div className="flex items-start space-x-3">
                      {/* <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <MdArticle className="w-4 h-4 text-blue-600" />
                      </div> */}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                          {result.title}
                        </h4>

                        {result.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {searchResults.total > 10 && (
                <div className="p-3 bg-gray-50 text-center w-full">
                  <button
                    onMouseDown={() =>
                      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
                    }
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    View all {searchResults.total} results →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogSearchBar;
