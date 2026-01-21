export type Subtask = {
  id: string;
  description: string;
  completed: boolean;
};

export type Project = {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD (end date)
  subtasks: Subtask[];
};

export type ProjectStatus = "ahead" | "on_track" | "behind";
