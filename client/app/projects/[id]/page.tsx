"use client";

import React, { useState, use } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import TaskModal from "@/app/(components)/TaskModal";

type Props = {
  params: Promise<{ id: string }>;
};

const TABS = {
  BOARD: "Board",
  LIST: "List",
  TIMELINE: "Timeline",
  TABLE: "Table",
};

const Project = ({ params }: Props) => {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState(TABS.BOARD);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <TaskModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto max-w-[95%] px-6 pb-8 xl:max-w-[1600px] 2xl:max-w-[1800px]">
        {activeTab === TABS.BOARD && (
          <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === TABS.LIST && (
          <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === TABS.TIMELINE && (
          <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === TABS.TABLE && (
          <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
      </div>
    </div>
  );
};

export default Project;
