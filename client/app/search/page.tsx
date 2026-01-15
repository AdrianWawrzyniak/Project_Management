"use client";
import { useSearchQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import Header from "../(components)/Header";
import TaskCard from "../(components)/TaskCard";
import ProjectCard from "../(components)/ProjectCard";
import UserCard from "../(components)/UserCard";

// do wyjebania
type Props = {};

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="container mx-auto max-w-[95%] px-6 py-8 xl:max-w-[1600px] 2xl:max-w-[1800px]">
      <Header name="Search" />
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
          onChange={handleSearch}
        />
      </div>
      <div className="space-y-6">
        {isLoading && (
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        )}
        {isError && (
          <p className="text-red-600 dark:text-red-400">
            Error occurred while fetching search results.
          </p>
        )}
        {!isLoading && !isError && searchResults && (
          <div className="space-y-8">
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  Tasks
                </h2>
                <div className="space-y-3">
                  {searchResults.tasks?.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
            {searchResults.projects && searchResults.projects?.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  Projects
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.projects?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}
            {searchResults.users && searchResults.users?.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  Users
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.users?.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
