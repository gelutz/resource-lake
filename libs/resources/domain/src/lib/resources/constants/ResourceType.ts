export const ResourceType = {
	Link: "link",
	Text: "text",
	Image: "image",
	File: "file",
} as const;

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];
