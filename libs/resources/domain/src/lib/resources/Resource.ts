import { AggregateRoot } from "../AggregateRoot";
import { ResourceCategory } from "./constants/ResourceCategory";
import { ResourceType } from "./constants/ResourceType";
import { DomainBaseError } from "./DomainBaseError";

export type ResourceProperties = Pick<
	Resource,
	"id" | "type" | "category" | "title" | "payload" | "createdAt"
>;

export class Resource implements AggregateRoot<string> {
	#id: string;
	#type: ResourceType;
	#category: ResourceCategory;
	#title?: string;
	#payload: string;
	#createdAt: string;

	constructor(input: Partial<Resource>) {
		this.validateInput(input);
		const { id, title, payload, type, category, createdAt } = input;

		this.#id = id;
		this.#type = type;
		this.#category = category;
		this.#title = title;
		this.#payload = payload;
		this.#createdAt = createdAt;
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

	changeType(newType: ResourceType) {
		this.validateType(newType);
		this.#type = newType;
	}

	changeCategory(newCategory: ResourceCategory) {
		this.validateCategory(newCategory);
		this.#category = newCategory;
	}

	validateInput(input: Partial<Resource>): void {
		if (!input.id?.length || !input.createdAt?.length) {
			throw new DomainBaseError(
				"Either ID or CreatedAt, required fields, are missing.",
			);
		}

		this.validateType(input.type);
		this.validateCategory(input.category);
	}

	validateType(type: ResourceType | undefined): void {
		if (!Object.values(ResourceType).includes(type)) {
			throw new DomainBaseError(
				"Tried to instantiate a Resource with invalid type: " + type,
			);
		}
	}

	validateCategory(category: ResourceCategory | undefined): void {
		if (!Object.values(ResourceCategory).includes(category)) {
			throw new DomainBaseError(
				"Tried to instantiate a Resource with invalid Category: " + category,
			);
		}
	}
}
