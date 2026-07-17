import { ResourceCategory } from "./constants/ResourceCategory";
import { ResourceType } from "./constants/ResourceType";

export type CreateResourceInput = {
	title?: string;
	payload: string;
	type: ResourceType;
	category: ResourceCategory;
};
