import { Resource } from "@rl/resources/domain";
import { Resources } from "@rl/resources/domain";

export class ResourceApplicationService {
	constructor(private repository: Resources) {}

	get = (id: Resource["id"]) => {
		return this.repository.getById(id);
	};

	listResources = (filter?: Partial<Resource>) => {
		return this.repository.list(filter);
	};

	saveResource = (r: Resource) => {
		return this.repository.save(r);
	};

	deleteResource = async (id: Resource["id"]) => {
		const target = await this.get(id);
		target.markAsDeleted();
		this.saveResource(target);
		Promise.resolve();
	};
}
