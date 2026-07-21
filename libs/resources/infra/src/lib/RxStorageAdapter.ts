import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { addRxPlugin, createRxDatabase, type RxStorage } from "rxdb";
import { disableWarnings, RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { ResourceSchema } from "./resources/ResourceSchema";

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
			disableWarnings();
			addRxPlugin(RxDBDevModePlugin);
			storage = wrappedValidateAjvStorage({ storage });
		}

		const db = await createRxDatabase({
			name: "lake",
			storage,
		});

		await db.addCollections({
			resources: { schema: ResourceSchema },
		});

		return db;
	};
}
