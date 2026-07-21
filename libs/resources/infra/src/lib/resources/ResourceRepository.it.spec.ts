import { RxDatabase } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxStorageAdapter } from "../RxStorageAdapter";
import { ResourceRepository } from "./ResourceRepository";
import { fakeResourceData } from "@rl/shared/util";
import {
	Resource,
	ResourceCategory,
	ResourceFactory,
	ResourceType,
} from "@rl/resources/domain";

describe("ResourceRepository Integration Tests", () => {
	const storage = () => getRxStorageMemory();
	const mockResources = fakeResourceData;

	let db: RxDatabase;
	let sut: ResourceRepository;

	beforeEach(async () => {
		db = await new RxStorageAdapter().createResourceDatabase({
			storage: storage(),
			devMode: true,
		});

		sut = new ResourceRepository(db.collections.resources);
	});

	afterEach(async () => {
		await db.remove(); // fresh empty storage every test
	});

	it("saving and retrieving by id", async () => {
		const resource = mockResources[0];
		const saved = await sut.save(resource);
		const retrieved = await sut.getById(resource.id);

		expect(saved.id).toEqual(resource.id);
		expect(saved.id).toEqual(retrieved.id);
	});

	it("list returns a list of saved, undeleted resources", async () => {
		Promise.all([
			sut.save(mockResources[0]),
			sut.save(mockResources[1]),
			sut.save(mockResources[2]),
			sut.save(mockResources[3]),
		]);

		await sut.delete(mockResources[0].id);
		const retrieved = await sut.list();

		expect(retrieved.length).toBe(3); // one less than saved, was deleted
	});

	it("list filters with ResourceProperties", async () => {
		const base = mockResources[0]; // is type=text x category=text

		const mock1 = ResourceFactory.existent({
			...base,
			id: crypto.randomUUID(),
			type: ResourceType.File,
		});
		const mock2 = ResourceFactory.existent({
			...base,
			id: crypto.randomUUID(),
			type: ResourceType.File,
		});
		const mock3 = ResourceFactory.existent({
			...base,
			id: crypto.randomUUID(),
			type: ResourceType.File,
			category: ResourceCategory.Audio,
		});
		const mock4 = ResourceFactory.existent({
			...base,
			id: crypto.randomUUID(),
			category: ResourceCategory.Audio,
		});

		await Promise.all([
			sut.save(mock1),
			sut.save(mock2),
			sut.save(mock3),
			sut.save(mock4),
		]);

		const retrievedById = await sut.list({
			id: mock1.id,
		});

		const retrievedByType = await sut.list({
			type: mock1.type,
		});

		const retrievedByCategory = await sut.list({
			category: mock3.category,
		});

		expect(retrievedById.length).toBe(1);
		expect(retrievedByType.length).toBe(3); // the three of type file
		expect(retrievedByCategory.length).toBe(2); // the two of audio category
	});
});
