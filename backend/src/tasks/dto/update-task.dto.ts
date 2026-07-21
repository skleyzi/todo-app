import {
	IsBoolean,
	IsInt,
	IsISO8601,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export class UpdateTaskDto {
	@IsOptional()
	@IsString()
	@MaxLength(200)
	title?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	category?: string;

	@IsOptional()
	@IsISO8601()
	dueDate?: string | null;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(10)
	priority?: number;

	@IsOptional()
	@IsBoolean()
	done?: boolean;
}
