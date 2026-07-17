import { ResourceAplicationService } from "./ResourceAplicationService";
import { FakeResourcesRepository } from "./fixtures/FakeResourcesRepository";

describe("Resource use-cases test suite", () => {
	const sut = new ResourceAplicationService(new FakeResourcesRepository());

	it("should list available resources", () => {
		const result = sut.listResources();
		const expectedLength = 6;

		expect(result.length).toBe(expectedLength);
	});
});
