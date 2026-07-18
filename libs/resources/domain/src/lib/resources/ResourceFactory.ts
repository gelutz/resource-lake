import { CreateResourceInput } from "./CreateResourceInput";
import { Resource } from "./Resource";

class ResourceFactoryImpl {
	base = (input: CreateResourceInput): Resource => {
		const id = crypto.randomUUID();
		const createdAt = new Date().toISOString();
		const { title, payload, type, category } = input;

		return new Resource({
			id,
			title,
			payload,
			type,
			category,
			createdAt,
			deleted: false,
		});
	};

	existent(input: Partial<Resource>): Resource {
		return new Resource(input);
	}
}

export const ResourceFactory = new ResourceFactoryImpl();
