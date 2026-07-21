import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { QueryTaskDto } from "./dto/query-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
	constructor(private readonly prisma: PrismaService) {}

	create(dto: CreateTaskDto) {
		return this.prisma.task.create({
			data: {
				title: dto.title,
				category: dto.category ?? null,
				dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
				priority: dto.priority ?? 5,
			},
		});
	}

	findAll(query: QueryTaskDto) {
		const where: Prisma.TaskWhereInput = {};

		if (query.status === "done") where.done = true;
		if (query.status === "undone") where.done = false;

		if (query.category) where.category = query.category;

		if (query.search) {
			where.title = { contains: query.search };
		}

		const orderBy: Prisma.TaskOrderByWithRelationInput[] = query.sortOrder
			? [{ priority: query.sortOrder }, { createdAt: "desc" }]
			: [{ createdAt: "desc" }];

		return this.prisma.task.findMany({ where, orderBy });
	}

	async findOne(id: string) {
		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) throw new NotFoundException(`Task ${id} not found`);
		return task;
	}

	async update(id: string, dto: UpdateTaskDto) {
		await this.findOne(id);
		return this.prisma.task.update({
			where: { id },
			data: {
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.category !== undefined && { category: dto.category }),
				...(dto.dueDate !== undefined && {
					dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
				}),
				...(dto.priority !== undefined && { priority: dto.priority }),
				...(dto.done !== undefined && { done: dto.done }),
			},
		});
	}

	async toggleDone(id: string) {
		const task = await this.findOne(id);
		return this.prisma.task.update({
			where: { id },
			data: { done: !task.done },
		});
	}

	async remove(id: string) {
		await this.findOne(id);
		await this.prisma.task.delete({ where: { id } });
		return { id };
	}

	async categories() {
		const rows = await this.prisma.task.findMany({
			where: { category: { not: null } },
			select: { category: true },
			distinct: ["category"],
		});
		return rows.map((r) => r.category).filter(Boolean);
	}
}
