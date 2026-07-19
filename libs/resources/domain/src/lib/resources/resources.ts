import { Repository } from "../Repository";
import { ResourceCategory } from "./constants/ResourceCategory";
import { Resource } from "./Resource";

export interface Resources extends Repository<Resource, Resource["id"]> {
	ofCategory(category: ResourceCategory): Promise<Resource[]>;
}
