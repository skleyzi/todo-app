"use client";

import { PriorityDots } from "@/components/tasks/priority";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import { CalendarDays, Trash2 } from "lucide-react";

interface TaskItemProps {
	task: Task;
	onToggle: (id: string) => void;
	onRemove: (id: string) => void;
}

export function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
	const due = task.dueDate ? new Date(task.dueDate) : null;
	const overdue = due && !task.done && isPast(due) && !isToday(due);
	const dueToday = due && !task.done && isToday(due);

	return (
		<li
			className={cn(
				"group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-colors",
				task.done && "opacity-60",
			)}
		>
			<Checkbox
				checked={task.done}
				onCheckedChange={() => onToggle(task.id)}
				aria-label={task.done ? "Mark as not done" : "Mark as done"}
			/>

			<div className="min-w-0 flex-1">
				<p
					className={cn(
						"truncate text-sm font-medium text-foreground",
						task.done && "line-through text-muted-foreground",
					)}
				>
					{task.title}
				</p>
				<div className="mt-1 flex flex-wrap items-center gap-2">
					<PriorityDots priority={task.priority} />
					{task.category && <Badge variant="accent">{task.category}</Badge>}
					{due && (
						<span
							className={cn(
								"inline-flex items-center gap-1 text-xs text-muted-foreground",
								overdue && "text-destructive font-medium",
								dueToday && "text-accent font-medium",
							)}
						>
							<CalendarDays className="size-3.5" />
							{format(due, "MMM d, yyyy")}
							{overdue && " · overdue"}
							{dueToday && " · today"}
						</span>
					)}
				</div>
			</div>

			<Button
				variant="ghost"
				size="icon"
				onClick={() => onRemove(task.id)}
				aria-label="Delete task"
				className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
			>
				<Trash2 />
			</Button>
		</li>
	);
}
