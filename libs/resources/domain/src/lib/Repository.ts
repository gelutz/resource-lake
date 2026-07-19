import { AggregateRoot } from "./AggregateRoot";

export interface Repository<T extends AggregateRoot<ID>, ID> {
	list(filter?: Partial<T>): Promise<T[]>;
	getById(id: ID): Promise<T>;
	save(t: T): Promise<T>;
	delete(id: ID): Promise<void>;
}
