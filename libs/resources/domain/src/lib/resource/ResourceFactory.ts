import { ResourceCategory } from "./constants/ResourceCategory";
import { ResourceType } from "./constants/ResourceType";
import { CreateResourceInput } from "./CreateResourceInput";
import { Resource } from "./Resource";

type CreateArticleResourceInput = {
	title: string;
	payload: string;
};

class ResourceFactoryImpl {
	base = (input: CreateResourceInput): Resource => {
		const { title, payload, type, category } = input;

		return new Resource({
			title,
			payload,
			type,
			category,
		});
	};

	article(input: CreateArticleResourceInput): Resource {
		return this.base({
			...input,
			type: ResourceType.Link,
			category: ResourceCategory.Text,
		});
	}
}

export const ResourceFactory = new ResourceFactoryImpl();
