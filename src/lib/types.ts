export type Subtask = {
  id: string;
  description: string;
  completed: boolean;
};

export type Project = {
  id: string;
  name: string;
  deadline: string; // YYYY-MM-DD
  subtasks: Subtask[];
};

export type ProjectStatus = "ahead" | "on_track" | "behind";
