import { Resource } from "@rl/resources/domain";

export class ResourceNotFoundError extends Error {
	constructor(id: Resource["id"]) {
		super("Resource not found with the given ID: " + id);
	}
}
