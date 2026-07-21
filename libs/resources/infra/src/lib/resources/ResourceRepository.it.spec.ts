import { RxDatabase } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxStorageAdapter } from "../RxStorageAdapter";
import { ResourceRepository } from "./ResourceRepository";
import {
	ResourceCategory,
	ResourceFactory,
	ResourceType,
} from "@rl/resources/domain";

describe("ResourceRepository Integration Tests", () => {
	let db: RxDatabase;
	let sut: ResourceRepository;

	const makeResource = () =>
		ResourceFactory.existent({
			id: "b3f1a2c4-1e2d-4a3b-9c5d-1a2b3c4d5e6f",
			type: ResourceType.Text,
			category: ResourceCategory.Text,
			title: "Getting Started with Domain-Driven Design",
			payload:
				"DDD focuses on modeling software to match a domain according to input from domain experts.",
			createdAt: "2026-01-05T10:15:00.000Z",
		});

	beforeEach(async () => {
		db = await new RxStorageAdapter().createResourceDatabase({
			storage: getRxStorageMemory(),
			devMode: true,
		});

		sut = new ResourceRepository(db.collections.resources);
	});

	afterEach(async () => {
		await db.remove(); // fresh empty storage every test
	});

	it("saving and retrieving by id", async () => {
		const resource = makeResource();
		const saved = await sut.save(resource);
		const retrieved = await sut.getById(resource.id);

		expect(saved.id).toEqual(resource.id);
		expect(saved.id).toEqual(retrieved.id);
	});
});
