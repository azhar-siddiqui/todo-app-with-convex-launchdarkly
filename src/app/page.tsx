"use client";

import { useFlags } from "launchdarkly-react-client-sdk";

import { EmptyContent, Loading, TaskForm, TaskList } from "./_components";

export default function Home() {
  const { sampleFeature, taskList } = useFlags();

  const flagsReady =
    typeof sampleFeature === "boolean" && typeof taskList === "boolean";

  if (!flagsReady) {
    return <Loading />;
  }

  if (!sampleFeature && !taskList) {
    return <EmptyContent />;
  }

  return (
    <div className="min-h-screen pt-4 w-full mx-auto max-w-xl">
      {sampleFeature && <TaskForm />}
      {taskList && <TaskList />}
    </div>
  );
}
