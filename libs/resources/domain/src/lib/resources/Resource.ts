import { AggregateRoot } from "../AggregateRoot";
import { ResourceCategory } from "./constants/ResourceCategory";
import { ResourceType } from "./constants/ResourceType";
import { DomainBaseError } from "./DomainBaseError";

export class Resource implements AggregateRoot<string> {
	#id: string;
	#type: ResourceType;
	#category: ResourceCategory;
	#title?: string;
	#payload: string;
	#createdAt: string;
	#updatedAt?: string;
	#_deleted: boolean;

	constructor(input: Partial<Resource>) {
		this.validateInput(input);
		const {
			id,
			title,
			payload,
			type,
			category,
			createdAt,
			deleted,
			updatedAt,
		} = input;

		this.#id = id;
		this.#type = type;
		this.#category = category;
		this.#title = title;
		this.#payload = payload;
		this.#createdAt = createdAt;
		this.#_deleted = deleted ?? false;
		this.#updatedAt = updatedAt;
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

	validateInput(input: Partial<Resource>): void {
		if (!input.id?.length || !input.createdAt?.length) {
			throw new DomainBaseError(
				"Either ID or CreatedAt, required fields, are missing.",
			);
		}

		if (!Object.values(ResourceType).includes(input.type)) {
			throw new DomainBaseError(
				"Tried to instantiate a Resource with invalid type: " + input.type,
			);
		}

		if (!Object.values(ResourceCategory).includes(input.category)) {
			throw new DomainBaseError(
				"Tried to instantiate a Resource with invalid category: " +
					input.category,
			);
		}
	}

	#touch() {
		this.#updatedAt = new Date().toISOString();
	}

	changeTitle(title: string) {
		this.#title = title;
		this.#touch();
	}

	markAsDeleted() {
		if (this.deleted)
			throw new DomainBaseError("Tried to delete a deleted resource");
		this.#_deleted = true;
		this.#touch();
	}
}
