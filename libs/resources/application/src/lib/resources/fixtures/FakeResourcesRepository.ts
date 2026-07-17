import { Resource, Resources } from "@rl/resources/domain";
import fakeResources from "./fake-resources.json";
import { CreateResourceInput } from "@rl/resources/domain";

export class FakeResourcesRepository implements Resources {
	#resources: Map<string, Resource>;

	constructor(
		snapshots: CreateResourceInput[] = fakeResources as CreateResourceInput[],
	) {
		this.#resources = new Map(
			snapshots.map((s) => new Resource(s)).map((s) => [s.id, s]),
		);
	}

	list(filter?: Partial<Resource>): Resource[] {
		const entries = [...this.#resources.values()];
		const keys = filter ? (Object.keys(filter) as (keyof Resource)[]) : [];
		return entries.filter((r) => keys.every((k) => r[k] === filter[k]));
	}

	getById(id: string): Resource {
		const resource = this.#resources.get(id);
		if (!resource) {
			throw new Error("No resource found with id: " + id);
		}
		return resource;
	}

	save(t: Resource): Resource {
		this.#resources.set(t.id, t);
		return t;
	}

	delete(id: string): void {
		this.#resources.delete(id);
	}

	ofCategory(categories: string[]): Resource["id"][] {
		return [...this.#resources.values()]
			.filter((r) => categories.includes(r.category))
			.map((r) => r.id);
	}
}
