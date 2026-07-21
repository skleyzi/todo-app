"use client";

import { AddTaskForm } from "@/components/tasks/add-task-form";
import { TaskList } from "@/components/tasks/task-list";
import { TaskToolbar } from "@/components/tasks/task-toolbar";
import { useTasks } from "@/hooks/use-tasks";

export default function Home() {
	const {
		tasks,
		categories,
		loading,
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
	} = useTasks();

	const hasFilters = Boolean(search || status !== "all" || category !== "All");

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:py-16">
			<header className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					Tasks
				</h1>
				<p className="text-sm text-muted-foreground">
					{counts.undone === 0
						? "You're all caught up."
						: `${counts.undone} task${counts.undone === 1 ? "" : "s"} left to do.`}
				</p>
			</header>

			<AddTaskForm onAdd={addTask} categories={categories} />

			<TaskToolbar
				search={search}
				onSearchChange={setSearch}
				status={status}
				onStatusChange={setStatus}
				category={category}
				onCategoryChange={setCategory}
				categories={categories}
				sortOrder={sortOrder}
				onSortOrderChange={setSortOrder}
				counts={counts}
			/>

			{error && (
				<div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
					{error}
				</div>
			)}

			<TaskList
				tasks={tasks}
				loading={loading}
				hasFilters={hasFilters}
				onToggle={toggleTask}
				onRemove={removeTask}
			/>
		</main>
	);
}
