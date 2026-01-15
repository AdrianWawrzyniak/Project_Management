import Modal from "@/app/(components)/Modal";
import { useCreateProjectMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ProjectModal = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async () => {
    if (!projectData.name || !projectData.startDate || !projectData.endDate)
      return;

    const formattedStartDate = formatISO(new Date(projectData.startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(projectData.endDate), {
      representation: "complete",
    });
    await createProject({
      name: projectData.name,
      description: projectData.description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };

  const isFormValid = () => {
    return (
      projectData.name &&
      projectData.description &&
      projectData.startDate &&
      projectData.endDate
    );
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="ProjectName"
          value={projectData.name}
          onChange={(e) =>
            setProjectData((prevState) => ({
              ...prevState,
              name: e.target.value,
            }))
          }
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={projectData.description}
          onChange={(e) =>
            setProjectData((prevState) => ({
              ...prevState,
              description: e.target.value,
            }))
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={projectData.startDate}
            onChange={(e) =>
              setProjectData((prevState) => ({
                ...prevState,
                startDate: e.target.value,
              }))
            }
          />
          <input
            type="date"
            className={inputStyles}
            value={projectData.endDate}
            onChange={(e) =>
              setProjectData((prevState) => ({
                ...prevState,
                endDate: e.target.value,
              }))
            }
          />
        </div>
        <button
          type="submit"
          className={`justift-center focus-offset-2 mt-4 flex w-full rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ProjectModal;
