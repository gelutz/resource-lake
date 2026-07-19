import { getRxStorageDexie, RxStorageDexie } from "rxdb/plugins/storage-dexie";
export class RxStorageAdapter {
	#storage: RxStorageDexie;

	constructor() {
		if (!this.#storage) {
			this.#storage = getRxStorageDexie();
		}
	}
}
