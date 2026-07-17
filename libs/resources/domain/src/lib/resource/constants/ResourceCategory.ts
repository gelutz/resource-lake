export const ResourceCategory = {
	Text: "text",
	Video: "video",
	Audio: "audio",
	Image: "image",
} as const;

export type ResourceCategory =
	(typeof ResourceCategory)[keyof typeof ResourceCategory];
