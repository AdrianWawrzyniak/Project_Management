import Modal from "@/app/(components)/Modal";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

const TaskModal = ({ isOpen, onClose, id }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: Status.ToDo,
    priority: Priority.Backlog,
    tags: "",
    startDate: "",
    dueDate: "",
    authorUserId: "",
    assignedUserId: "",
    projectId: "",
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.authorUserId) return;

    const formattedStartDate = formData.startDate
      ? formatISO(new Date(formData.startDate), {
          representation: "complete",
        })
      : undefined;
    const formattedDueDate = formData.dueDate
      ? formatISO(new Date(formData.dueDate), {
          representation: "complete",
        })
      : undefined;

    const taskData = {
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status || Status.ToDo,
      priority: formData.priority || Priority.Backlog,
      tags: formData.tags || undefined,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      authorUserId: parseInt(formData.authorUserId),
      assignedUserId: formData.assignedUserId
        ? parseInt(formData.assignedUserId)
        : undefined,
      projectId: Number(id),
    };

    console.log("Creating task with data:", taskData);
    await createTask(taskData);
  };

  const isFormValid = () => {
    return formData.title && formData.authorUserId;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiar dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
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
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={formData.status}
            onChange={(e) => {
              const value = e.target.value as Status;
              if (value) {
                setFormData((prev) => ({ ...prev, status: value }));
              }
            }}
          >
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={formData.priority}
            onChange={(e) => {
              const value = e.target.value as Priority;
              if (value) {
                setFormData((prev) => ({ ...prev, priority: value }));
              }
            }}
          >
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tags: e.target.value }))
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={formData.startDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <input
            type="date"
            className={inputStyles}
            value={formData.dueDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          />
        </div>
        {/* input component */}
        <input
          type="text"
          className={inputStyles}
          placeholder="Author User ID"
          value={formData.authorUserId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, authorUserId: e.target.value }))
          }
        />
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={formData.assignedUserId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, assignedUserId: e.target.value }))
          }
        />
        <button
          type="submit"
          className={`justift-center focus-offset-2 mt-4 flex w-full rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default TaskModal;
