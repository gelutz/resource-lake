import {
	getRxStorageDexie,
	RxStorageDexie,
	createDexieStorageInstance,
} from "rxdb/plugins/storage-dexie";
import { addRxPlugin, createRxDatabase, type RxStorage } from "rxdb";
import { disableWarnings, RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { ResourceSchema } from "./resources/ResourceSchema";

type CreateDatabaseInput = {
	storage: RxStorage<unknown, unknown>;
	devMode: boolean;
};

interface Database {}

interface StorageAdapter {
	createDatabase(params: unknown): Database;
}

export class RxStorageAdapter {
	createResourcesRxDatabase = async ({ storage, devMode }) => {
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
