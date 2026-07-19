import {
	Resource,
	ResourceCategory,
	ResourceFactory,
	Resources,
} from "@rl/resources/domain";
import { CreateResourceInput } from "@rl/resources/domain";

export class InMemoryResourceProvider implements Resources {
	#resources: Map<string, Resource>;

	constructor(snapshots: CreateResourceInput[]) {
		this.#resources = new Map(
			snapshots.map((s) => ResourceFactory.existent(s)).map((s) => [s.id, s]),
		);
	}

	list(filter?: Partial<Resource>): Promise<Resource[]> {
		const entries = [...this.#resources.values()];
		const keys = filter ? (Object.keys(filter) as (keyof Resource)[]) : [];
		const result = entries
			.filter((r) => !r.deleted)
			.filter((r) => keys.every((k) => r[k] === filter[k]));
		return Promise.resolve(result);
	}

	getById(id: string): Promise<Resource> {
		const resource = this.#resources.get(id);
		if (!resource) {
			throw new Error("No resource found with id: " + id);
		}
		return Promise.resolve(resource);
	}

	save(t: Resource): Promise<Resource> {
		this.#resources.set(t.id, t);
		return Promise.resolve(ResourceFactory.existent(t));
	}

	delete(id: string): Promise<void> {
		this.#resources.delete(id);
		return Promise.resolve();
	}

	ofCategory(category: ResourceCategory): Promise<Resource[]> {
		const result = [...this.#resources.values()].filter(
			(r) => r.category === category,
		);
		return Promise.resolve(result);
	}
}
