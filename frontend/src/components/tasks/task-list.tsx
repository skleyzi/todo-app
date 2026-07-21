"use client";

import { TaskItem } from "@/components/tasks/task-item";
import type { Task } from "@/lib/types";
import { ClipboardList } from "lucide-react";

interface TaskListProps {
	tasks: Task[];
	loading: boolean;
	hasFilters: boolean;
	onToggle: (id: string) => void;
	onRemove: (id: string) => void;
}

export function TaskList({
	tasks,
	loading,
	hasFilters,
	onToggle,
	onRemove,
}: TaskListProps) {
	if (loading && tasks.length === 0) {
		return (
			<div className="flex flex-col gap-2">
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className="h-15 animate-pulse rounded-xl border border-border bg-muted"
					/>
				))}
			</div>
		);
	}

	if (tasks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
				<ClipboardList className="size-8 text-muted-foreground" />
				<div>
					<p className="font-medium text-foreground">
						{hasFilters ? "No matching tasks" : "Nothing here yet"}
					</p>
					<p className="text-sm text-muted-foreground">
						{hasFilters
							? "Try a different search or filter."
							: "Add your first task above to get started."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<ul className="flex flex-col gap-2">
			{tasks.map((task) => (
				<TaskItem
					key={task.id}
					task={task}
					onToggle={onToggle}
					onRemove={onRemove}
				/>
			))}
		</ul>
	);
}
