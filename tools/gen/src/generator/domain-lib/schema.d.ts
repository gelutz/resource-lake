export type DomainLibType = "domain" | "feature" | "infra" | "ui" | "app";

export interface DomainLibGeneratorSchema {
	name: string;
	type: DomainLibType;
	scope: string;
}
