import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { addRxPlugin, createRxDatabase, type RxStorage } from "rxdb";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { resourceSchema } from "./resources/ResourceSchema";

type CreateDatabaseInput = {
	storage: RxStorage<unknown, unknown>;
	devMode: boolean;
};

export const rxStorageDexieFactory = getRxStorageDexie;

export class RxStorageAdapter {
	createResourceDatabase = async ({
		storage,
		devMode,
	}: CreateDatabaseInput) => {
		if (devMode) {
			await import("rxdb/plugins/dev-mode").then((module) => {
				module.disableWarnings();
				addRxPlugin(module.RxDBDevModePlugin);
				storage = wrappedValidateAjvStorage({ storage });
			});
		}

		const db = await createRxDatabase({
			name: "lake",
			storage,
		});

		await db.addCollections({
			resources: { schema: resourceSchema },
		});

		return db;
	};
}
