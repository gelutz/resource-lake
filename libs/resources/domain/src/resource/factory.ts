import { CreateResourceInput } from "./CreateResourceInput";
import { Resource } from "./Resource";

class ResourceFactoryImpl {
	base = (input: CreateResourceInput): Resource => {
		const createdAt = new Date().toISOString();
		const id = Math.random().toString();
		const { title, payload, type, category } = input;

		return {
			id,
			title,
			payload,
			type,
			category,
			createdAt,
		};
	};
}

export const ResourceFactory = new ResourceFactoryImpl();
