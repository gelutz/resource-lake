import { AggregateRoot } from "./AggregateRoot";

export interface Repository<T extends AggregateRoot<ID>, ID> {
	list(filter?: Partial<T>): T[];
	getById(id: ID): T;
	save(t: T): T;
	delete(id: ID): void;
}
