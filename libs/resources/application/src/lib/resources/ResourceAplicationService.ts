import { Resource } from "@rl/resources/domain";
import { Resources } from "@rl/resources/domain";

export class ResourceAplicationService {
	constructor(private repository: Resources) {}

	listResources = (filter?: Partial<Resource>) => {
		return this.repository.list(filter);
	};

	saveResource = (r: Resource): Resource => {
		return this.repository.save(r);
	};

	deleteResource = (id: Resource["id"]) => {
		this.repository.getById(id).markAsDeleted();
	};
}
