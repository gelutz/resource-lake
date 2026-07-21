import {
	ResourceCategory,
	ResourceProperties,
	ResourceType,
} from "@rl/resources/domain";
import { RxJsonSchema } from "rxdb";

/** "...DocType é um nome que o rxdb usa pra representar uma interface qualquer (nesse caso, um Resource)" */
export type ResourceDocType = ResourceProperties & {
	updatedAt: string;
};

export const resourceSchema: RxJsonSchema<ResourceDocType> = {
	version: 0,
	primaryKey: "id",
	type: "object",
	properties: {
		id: {
			type: "string",
			maxLength: 100, // <- the primary key must have maxLength
		},
		title: {
			type: "string",
		},
		payload: {
			type: "string",
		},
		type: {
			type: "string",
			enum: Object.values(ResourceType),
		},
		category: {
			type: "string",
			enum: Object.values(ResourceCategory),
		},
		createdAt: {
			type: "string",
			format: "date-time",
		},
		updatedAt: {
			type: "string",
			format: "date-time",
		},
	},
	required: [
		"id",
		"title",
		"payload",
		"type",
		"category",
		"createdAt",
		"updatedAt",
	],
} as const;
