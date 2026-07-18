import { ResourceApplicationService } from "./ResourceApplicationService";
import {
	CreateResourceInput,
	Resource,
	ResourceCategory,
	ResourceFactory,
	ResourceType,
} from "@rl/resources/domain";
import { InMemoryResourceProvider } from "./tests/fake/InMemoryResourceProvider";
import fakeResourceData from "./tests/fake/fake-resources.json";

describe("Resource use-cases test suite", () => {
	let sut: ResourceApplicationService;
	const resources = fakeResourceData as CreateResourceInput[];

	const makeResource = (index: 0 | 1 | 2 = 0) =>
		ResourceFactory.existent(resources[index]);

	beforeEach(() => {
		const repositoryImpl = new InMemoryResourceProvider(resources);
		sut = new ResourceApplicationService(repositoryImpl);
	});

	it("should list available (not deleted) resources", () => {
		const result = sut.listResources();
		const expectedLength = resources.length;

		expect(result.length).toEqual(expectedLength);
	});

	it("should save when input is valid", () => {
		const validResource = makeResource();
		const result = sut.saveResource(validResource);

		expect(result.id).toBeDefined();
		expect(result.deleted).toBeFalsy();
	});

	it("save should return a new instance of the object", () => {
		const validResource = makeResource();
		const result = sut.saveResource(validResource);

		expect(result.title).toEqual(validResource.title);
		expect(result).not.toBe(validResource);
	});

	it("should update when saving with an id that exists in the repo", () => {
		const validResource = makeResource();
		const result = sut.saveResource(validResource);

		expect(sut.listResources().length).toEqual(resources.length);
		expect(result.title).toEqual(validResource.title);

		validResource.changeTitle("New title");

		const result2 = sut.saveResource(validResource);
		console.log(result.title, result2.title);
		expect(result.id).toEqual(result2.id);
		expect(result.title).not.toEqual(result2.title);
		expect(sut.listResources().length).toEqual(resources.length);
	});

	it("should mark as deleted and not be returned from list nor getById", () => {
		const listBeforeDeleting = sut.listResources();
		const validResource = listBeforeDeleting.at(0);
		validResource.markAsDeleted();

		sut.saveResource(validResource);

		const listAfterDeleting = sut.listResources();
		const sameIndexValidResource = listAfterDeleting.at(0);

		expect(validResource.id).not.toEqual(sameIndexValidResource.id);
		expect(listBeforeDeleting.length).not.toEqual(listAfterDeleting.length);
	});
});
