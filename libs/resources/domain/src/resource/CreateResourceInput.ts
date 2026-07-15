import { Resource } from "./Resource";

export type CreateResourceInput = Pick<
	Resource,
	"title" | "payload" | "type" | "category"
>;
