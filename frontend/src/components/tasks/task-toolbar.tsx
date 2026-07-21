"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { SortOrder, StatusFilter } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from "lucide-react";

interface TaskToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	status: StatusFilter;
	onStatusChange: (value: StatusFilter) => void;
	category: string;
	onCategoryChange: (value: string) => void;
	categories: string[];
	sortOrder: SortOrder;
	onSortOrderChange: (value: SortOrder) => void;
	counts: { all: number; done: number; undone: number };
}

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "undone", label: "To do" },
	{ value: "done", label: "Done" },
];

export function TaskToolbar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	category,
	onCategoryChange,
	categories,
	sortOrder,
	onSortOrderChange,
	counts,
}: TaskToolbarProps) {
	function toggleSort() {
		if (sortOrder === null) onSortOrderChange("desc");
		else if (sortOrder === "desc") onSortOrderChange("asc");
		else onSortOrderChange(null);
	}

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
				{STATUS_TABS.map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => onStatusChange(tab.value)}
						className={cn(
							"inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
							status === tab.value
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{tab.label}
						<span className="ml-1.5 min-w-[1ch] text-center tabular-nums opacity-70">
							{counts[tab.value]}
						</span>
					</button>
				))}
			</div>

			<div className="flex flex-1 items-center gap-2 sm:max-w-md">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Search tasks…"
						className="pl-9"
						aria-label="Search tasks"
					/>
				</div>

				{categories.length > 0 && (
					<Select
						value={category}
						onValueChange={(value) =>
							onCategoryChange(value ?? "All categories")
						}
					>
						<SelectTrigger className="w-36 shrink-0">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All</SelectItem>
							{categories.map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={toggleSort}
					aria-label="Toggle sort by priority"
					title={
						sortOrder === "desc"
							? "Sorted: high priority first"
							: sortOrder === "asc"
								? "Sorted: low priority first"
								: "Sort by priority"
					}
					className={cn("shrink-0", sortOrder && "border-accent text-accent")}
				>
					{sortOrder === "asc" ? (
						<ArrowUpNarrowWide />
					) : (
						<ArrowDownWideNarrow />
					)}
				</Button>
			</div>
		</div>
	);
}
