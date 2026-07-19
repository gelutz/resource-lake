import { ResourceCategory } from "./constants/ResourceCategory";
import { ResourceType } from "./constants/ResourceType";
import { Resource } from "./Resource";
import { ResourceFactory } from "./ResourceFactory";

describe("Resource constructor invariants", () => {
	const createResourceInput = {
		title: "Some title",
		payload: "Some link",
		type: ResourceType.Text,
		category: ResourceCategory.Text,
	};

	it("id and createdAt should always be set", () => {
		const resource = ResourceFactory.base(createResourceInput);

		expect(resource.id).not.toBeNull();
		expect(resource.createdAt).not.toBeNull();
	});

	it("createdAt should be ISO strings", () => {
		const resource = ResourceFactory.base(createResourceInput);
		expect(typeof resource.createdAt).toBe("string");
	});

	it("should throw when constructing with invalid ResourceType or ResourceCategory", () => {
		expect(() => {
			new Resource({
				title: "Some title",
				payload: "Some link",
				type: "other" as ResourceType,
				category: ResourceCategory.Text,
			});
		}).toThrow();

		expect(() => {
			new Resource({
				title: "Some title",
				payload: "Some link",
				type: ResourceType.Text,
				category: "other" as ResourceCategory,
			});
		}).toThrow();
	});

	it("should build any resources of any axis (type x category)", () => {
		const resources = [];
		for (const t of Object.values(ResourceType)) {
			for (const c of Object.values(ResourceCategory)) {
				resources.push(
					ResourceFactory.base({
						title: "some title",
						payload: "anything, really",
						type: t,
						category: c,
					}),
				);
			}
		}

		const expectedArrayLength =
			Object.values(ResourceType).length *
			Object.values(ResourceCategory).length;
		expect(resources.length).toBe(expectedArrayLength);
	});
});
