import { ResourceCategory } from "./constants/ResourceCategory";
import { ResourceType } from "./constants/ResourceType";
import { CreateResourceInput } from "./CreateResourceInput";

export class Resource {
	#id: string;
	#type: ResourceType;
	#category: ResourceCategory;
	#title?: string;
	#payload: string;
	#createdAt: string;
	#updatedAt?: string;
	#_deleted: boolean;

	constructor(input: CreateResourceInput) {
		const { title, payload, type, category } = input;
		if (!Object.values(ResourceType).includes(type)) {
			throw new Error(
				"Tried to instantiate a Resource with invalid type: " + type,
			);
		}

		if (!Object.values(ResourceCategory).includes(category)) {
			throw new Error(
				"Tried to instantiate a Resource with invalid category: " + category,
			);
		}

		const id = crypto.randomUUID();
		const createdAt = new Date().toISOString();

		this.#id = id;
		this.#type = type;
		this.#category = category;
		this.#title = title;
		this.#payload = payload;
		this.#createdAt = createdAt;
		this.#_deleted = false;
	}

	get id() {
		return this.#id;
	}
	get type() {
		return this.#type;
	}
	get category() {
		return this.#category;
	}
	get title() {
		return this.#title;
	}
	get payload() {
		return this.#payload;
	}
	get createdAt() {
		return this.#createdAt;
	}
	get updatedAt() {
		return this.#updatedAt;
	}
	get deleted() {
		return this.#_deleted;
	}

	#touch() {
		this.#updatedAt = new Date().toISOString();
	}

	markAsDeleted() {
		this.#_deleted = true;
		this.#touch();
	}
}
