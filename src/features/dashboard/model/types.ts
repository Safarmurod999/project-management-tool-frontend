/** Tabs of the "my tasks" block, mapped to the `done` query param */
export type TaskTab = "open" | "done" | "all";

export const taskTabToDone = (tab: TaskTab): boolean | undefined =>
  tab === "all" ? undefined : tab === "done";
