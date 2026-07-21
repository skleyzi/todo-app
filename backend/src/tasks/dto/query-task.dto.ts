import { IsIn, IsOptional, IsString } from "class-validator";

export class QueryTaskDto {
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsIn(["all", "done", "undone"])
	status?: "all" | "done" | "undone";

	@IsOptional()
	@IsString()
	category?: string;

	@IsOptional()
	@IsIn(["asc", "desc"])
	sortOrder?: "asc" | "desc";
}
