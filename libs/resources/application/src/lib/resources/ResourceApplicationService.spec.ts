import { ResourceApplicationService } from "./ResourceApplicationService";
import { CreateResourceInput, ResourceFactory } from "@rl/resources/domain";
import { InMemoryResourceRepository } from "./InMemoryResourceRepository";
import { fakeResourceData } from "@rl/shared/util";

describe("Resource use-cases test suite", () => {
	let sut: ResourceApplicationService;
	const resources = fakeResourceData as CreateResourceInput[];

	const makeResource = (index: 0 | 1 | 2 = 0) =>
		ResourceFactory.existent(resources[index]);

	beforeEach(() => {
		const repositoryImpl = new InMemoryResourceRepository(resources);
		sut = new ResourceApplicationService(repositoryImpl);
	});

	it("should list available (not deleted) resources", async () => {
		const result = await sut.listResources();
		const expectedLength = resources.length;

		expect(result.length).toEqual(expectedLength);
	});

	it("should save when input is valid", async () => {
		const validResource = makeResource();
		const result = await sut.saveResource(validResource);

		expect(result.id).toBeDefined();
	});

	it("save should return a new instance of the object", async () => {
		const validResource = makeResource();
		const result = await sut.saveResource(validResource);

		expect(result.title).toEqual(validResource.title);
		expect(result).not.toBe(validResource);
	});
});
