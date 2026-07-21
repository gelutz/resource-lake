import {
	Resource,
	ResourceCategory,
	ResourceProperties,
	Resources,
} from "@rl/resources/domain";
import { RxCollection } from "rxdb";
import { ResourceDocType } from "./ResourceSchema";
import { ResourceConverter } from "./ResourceConverter";
import { stripUndefined } from "../../utils/stripUndefined";

export class ResourceRepository implements Resources {
	constructor(private readonly collection: RxCollection<ResourceDocType>) {}

	async ofCategory(category: ResourceCategory): Promise<Resource[]> {
		return this.collection
			.find({
				selector: { category },
			})
			.exec()
			.then((document) => document.map(ResourceConverter.toDomain));
	}
	async list(filter?: Partial<ResourceProperties>): Promise<Resource[]> {
		return this.collection
			.find({
				selector: stripUndefined(filter),
			})
			.exec()
			.then((document) => document.map(ResourceConverter.toDomain));
	}
	async getById(id: string): Promise<Resource> {
		return this.collection
			.findOne({
				selector: { id },
			})
			.exec(true) // true makes it throw if missing
			.then((resource) => ResourceConverter.toDomain(resource));
	}
	async save(t: Resource): Promise<Resource> {
		await this.collection.upsert(ResourceConverter.toDocument(t));
		return t;
	}

	async delete(id: string): Promise<void> {
		await this.collection
			.findOne({
				selector: {
					id,
				},
			})
			.remove();
		return Promise.resolve();
	}
}
