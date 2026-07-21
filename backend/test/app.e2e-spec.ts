import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("Tasks (e2e)", () => {
	let app: INestApplication<App>;
	let createdId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({ whitelist: true, transform: true }),
		);
		app.setGlobalPrefix("api");
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it("POST /api/tasks creates a task", async () => {
		const res = await request(app.getHttpServer())
			.post("/api/tasks")
			.send({ title: "Write e2e tests", category: "Work", priority: 8 })
			.expect(201);

		expect(res.body.title).toBe("Write e2e tests");
		expect(res.body.done).toBe(false);
		createdId = res.body.id;
	});

	it("GET /api/tasks lists tasks", async () => {
		const res = await request(app.getHttpServer())
			.get("/api/tasks")
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((t: { id: string }) => t.id === createdId)).toBe(true);
	});

	it("PATCH /api/tasks/:id/toggle marks a task done", async () => {
		const res = await request(app.getHttpServer())
			.patch(`/api/tasks/${createdId}/toggle`)
			.expect(200);

		expect(res.body.done).toBe(true);
	});

	it("GET /api/tasks?status=done filters by status", async () => {
		const res = await request(app.getHttpServer())
			.get("/api/tasks?status=done")
			.expect(200);

		expect(res.body.every((t: { done: boolean }) => t.done === true)).toBe(
			true,
		);
	});

	it("DELETE /api/tasks/:id removes a task", async () => {
		await request(app.getHttpServer())
			.delete(`/api/tasks/${createdId}`)
			.expect(200);

		await request(app.getHttpServer())
			.get(`/api/tasks/${createdId}`)
			.expect(404);
	});
});
