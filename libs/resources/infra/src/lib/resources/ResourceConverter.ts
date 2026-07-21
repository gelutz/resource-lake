import { ResourceDocType } from "./ResourceSchema";
import { Resource, ResourceFactory } from "@rl/resources/domain";

export class ResourceConverter {
	static toDomain = (document: ResourceDocType): Resource => {
		return ResourceFactory.existent({
			id: document.id,
			title: document.title,
			payload: document.payload,
			type: document.type,
			category: document.category,
			createdAt: document.createdAt,
		});
	};

	static toDocument = (resource: Resource): ResourceDocType => {
		return {
			id: resource.id,
			title: resource.title,
			payload: resource.payload,
			type: resource.type,
			category: resource.category,
			createdAt: resource.createdAt,
			updatedAt: new Date().toISOString(),
		};
	};
}
