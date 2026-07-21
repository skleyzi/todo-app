import {
	IsInt,
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export class CreateTaskDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	title!: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	category?: string;

	@IsOptional()
	@IsISO8601()
	dueDate?: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(10)
	priority?: number;
}
