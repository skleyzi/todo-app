"use client";

import { api } from "@/lib/api";
import type {
	CreateTaskInput,
	SortOrder,
	StatusFilter,
	Task,
} from "@/lib/types";
import { useCallback, useEffect, useState, useTransition } from "react";

export function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [counts, setCounts] = useState({ all: 0, done: 0, undone: 0 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<StatusFilter>("all");
	const [category, setCategory] = useState<string>("All");
	const [sortOrder, setSortOrder] = useState<SortOrder>(null);

	const refresh = useCallback(async () => {
		try {
			setError(null);
			const [taskList, categoryList, allForCounts] = await Promise.all([
				api.listTasks({
					search: search || undefined,
					status: status === "all" ? undefined : status,
					category: category === "All" ? undefined : category,
					sortOrder: sortOrder ?? undefined,
				}),
				api.listCategories(),
				api.listTasks({ search: search || undefined }),
			]);
			setTasks(taskList);
			setCategories(categoryList);
			setCounts({
				all: allForCounts.length,
				done: allForCounts.filter((t) => t.done).length,
				undone: allForCounts.filter((t) => !t.done).length,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load tasks");
		} finally {
			setLoading(false);
		}
	}, [search, status, category, sortOrder]);

	useEffect(() => {
		const handle = setTimeout(() => {
			startTransition(() => {
				refresh();
			});
		}, 250);
		return () => clearTimeout(handle);
	}, [refresh]);

	const addTask = useCallback(
		async (input: CreateTaskInput) => {
			const created = await api.createTask(input);
			setTasks((prev) => [created, ...prev]);
			setCounts((prev) => ({
				all: prev.all + 1,
				done: prev.done,
				undone: prev.undone + 1,
			}));
			if (created.category && !categories.includes(created.category)) {
				setCategories((prev) => [...prev, created.category as string]);
			}
		},
		[categories],
	);

	const removeTask = useCallback(
		async (id: string) => {
			const removed = tasks.find((t) => t.id === id);
			setTasks((prev) => prev.filter((t) => t.id !== id));
			if (removed) {
				setCounts((prev) => ({
					all: prev.all - 1,
					done: removed.done ? prev.done - 1 : prev.done,
					undone: removed.done ? prev.undone : prev.undone - 1,
				}));
			}
			try {
				await api.deleteTask(id);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to delete task");
			}
		},
		[tasks],
	);

	const toggleTask = useCallback(
		async (id: string) => {
			const target = tasks.find((t) => t.id === id);
			setTasks((prev) =>
				prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
			);
			if (target) {
				setCounts((prev) =>
					target.done
						? { ...prev, done: prev.done - 1, undone: prev.undone + 1 }
						: { ...prev, done: prev.done + 1, undone: prev.undone - 1 },
				);
			}
			try {
				await api.toggleTask(id);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to update task");
			}
		},
		[tasks],
	);

	return {
		tasks,
		categories,
		loading: loading || isPending,
		error,
		search,
		setSearch,
		status,
		setStatus,
		category,
		setCategory,
		sortOrder,
		setSortOrder,
		counts,
		addTask,
		removeTask,
		toggleTask,
	};
}
