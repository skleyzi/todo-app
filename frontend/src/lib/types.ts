export interface Task {
  id: string;
  title: string;
  category: string | null;
  dueDate: string | null;
  priority: number;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  category?: string;
  dueDate?: string;
  priority?: number;
}

export interface UpdateTaskInput {
  title?: string;
  category?: string | null;
  dueDate?: string | null;
  priority?: number;
  done?: boolean;
}

export type StatusFilter = "all" | "done" | "undone";
export type SortOrder = "asc" | "desc" | null;
