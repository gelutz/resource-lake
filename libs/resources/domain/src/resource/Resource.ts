export type ResourceType = "link" | "text" | "image" | "file";
export type ResourceCategory = "text" | "video" | "audio" | "image";

export type Resource = {
	id: string;
	type: ResourceType;
	category: ResourceCategory;
	title?: string;
	payload: string;
	createdAt: string;
	updatedAt?: string;
	_deleted?: boolean;
};
