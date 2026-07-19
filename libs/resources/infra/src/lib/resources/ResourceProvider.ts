import {
	Resource,
	ResourceCategory,
	ResourceFactory,
	Resources,
} from "@rl/resources/domain";
import { RxCollection } from "rxdb";
import { ResourceDocType } from "./ResourceSchema";

const toDomain = (document: ResourceDocType): Resource => {
	return ResourceFactory.existent(document);
};

const toDocument = (resource: Resource): ResourceDocType => {
	return {
		id: resource.id,
		title: resource.title,
		payload: resource.payload,
		type: resource.type,
		category: resource.category,
		createdAt: resource.createdAt,
		updatedAt: resource.updatedAt,
	};
};

export class ResourceProvider implements Resources {
	constructor(private readonly collection: RxCollection<ResourceDocType>) {}

	async ofCategory(category: ResourceCategory): Promise<Resource[]> {
		return this.collection
			.find({
				selector: { category },
			})
			.exec()
			.then((document) => document.map(toDomain));
	}
	async list(filter?: Partial<Resource>): Promise<Resource[]> {
		return this.collection
			.find({
				selector: {
					...filter,
				},
			})
			.exec()
			.then((document) => document.map(toDomain));
	}
	async getById(id: string): Promise<Resource> {
		return this.collection
			.find({
				selector: { id },
			})
			.exec()
			.then(([resource]) => toDomain(resource));
	}
	async save(t: Resource): Promise<Resource> {
		await this.collection.upsert(toDocument(t));
		return t;
	}

	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
