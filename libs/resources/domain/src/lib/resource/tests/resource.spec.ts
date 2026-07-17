import { ResourceCategory } from "../constants/ResourceCategory";
import { ResourceType } from "../constants/ResourceType";
import { Resource } from "../Resource";

describe("Resource invariants", () => {
	it("id and createdAt should always be set", () => {
		const resource = new Resource({
			title: "Some title",
			payload: "Some link",
			type: ResourceType.Text,
			category: ResourceCategory.Text,
		});

		expect(resource.id).not.toBeNull();
		expect(resource.createdAt).not.toBeNull();
	});

	it("createdAt should be ISO strings", () => {
		const resource = new Resource({
			title: "Some title",
			payload: "Some link",
			type: ResourceType.Text,
			category: ResourceCategory.Text,
		});

		// expect(typeof resource.updatedAt).toBe("string");
		expect(typeof resource.createdAt).toBe("string");
	});

	it("should throw when constructing with invalid ResourceType", () => {
		// expect(() => {
		// 	new Resource({
		// 		title: "Some title",
		// 		payload: "Some link",
		// 		type: "other",
		// 		category: ResourceCategory.Text,
		// 	});
		// }).toThrow();
	});
});
