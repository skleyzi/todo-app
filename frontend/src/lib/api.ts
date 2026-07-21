import type { Task, CreateTaskInput, UpdateTaskInput } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message ?? `Request failed with status ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface ListTasksParams {
  search?: string;
  status?: "all" | "done" | "undone";
  category?: string;
  sortOrder?: "asc" | "desc";
}

export const api = {
  listTasks(params: ListTasksParams = {}): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.category) query.set("category", params.category);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    const qs = query.toString();
    return request<Task[]>(`/tasks${qs ? `?${qs}` : ""}`);
  },

  createTask(input: CreateTaskInput): Promise<Task> {
    return request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    return request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  toggleTask(id: string): Promise<Task> {
    return request<Task>(`/tasks/${id}/toggle`, { method: "PATCH" });
  },

  deleteTask(id: string): Promise<{ id: string }> {
    return request<{ id: string }>(`/tasks/${id}`, { method: "DELETE" });
  },

  listCategories(): Promise<string[]> {
    return request<string[]>("/tasks/categories");
  },
};
