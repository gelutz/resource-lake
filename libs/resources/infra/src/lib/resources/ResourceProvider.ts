import { Resource, ResourceCategory, Resources } from "@rl/resources/domain";

class ResourceProvider implements Resources {
	ofCategory(category: ResourceCategory): Resource[] {
		throw new Error("Method not implemented.");
	}
	list(filter?: Partial<Resource>): Resource[] {
		throw new Error("Method not implemented.");
	}
	getById(id: string): Resource {
		throw new Error("Method not implemented.");
	}
	save(t: Resource): Resource {
		throw new Error("Method not implemented.");
	}
	delete(id: string): void {
		throw new Error("Method not implemented.");
	}
}
