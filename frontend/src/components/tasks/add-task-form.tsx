"use client";

import { PrioritySelect } from "@/components/tasks/priority";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateTaskInput } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddTaskFormProps {
	onAdd: (input: CreateTaskInput) => Promise<void>;
	categories: string[];
}

export function AddTaskForm({ onAdd, categories }: AddTaskFormProps) {
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [priority, setPriority] = useState(5);
	const [expanded, setExpanded] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = title.trim();
		if (!trimmed || submitting) return;

		setSubmitting(true);
		try {
			await onAdd({
				title: trimmed,
				category: category.trim() || undefined,
				dueDate: dueDate || undefined,
				priority,
			});
			setTitle("");
			setCategory("");
			setDueDate("");
			setPriority(5);
			setExpanded(false);
		} finally {
			setSubmitting(false);
		}
	}

	const today = new Date().toISOString().split("T")[0];

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-xl border border-border bg-card p-4 shadow-sm"
		>
			<div className="flex gap-2">
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onFocus={() => setExpanded(true)}
					placeholder="Add a task…"
					aria-label="Task title"
					className="flex-1"
				/>
				<Button type="submit" disabled={!title.trim() || submitting}>
					<Plus />
					Add
				</Button>
			</div>

			{expanded && (
				<div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4">
					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium text-muted-foreground">
							Category
						</span>
						<Input
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							placeholder="e.g. Work"
							list="category-suggestions"
							className="h-9 w-36"
						/>
						<datalist id="category-suggestions">
							{categories.map((c) => (
								<option key={c} value={c} />
							))}
						</datalist>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium text-muted-foreground">
							Due date
						</span>
						<Input
							type="date"
							min={today}
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							className="h-9 w-40"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium text-muted-foreground">
							Priority
						</span>
						<PrioritySelect value={priority} onChange={setPriority} />
					</div>
				</div>
			)}
		</form>
	);
}
