import { Repository } from "../Repository";
import { Resource } from "./Resource";

export interface Resources extends Repository<Resource, Resource["id"]> {
	ofCategory(t: string[]): Resource["id"][];
}
