export type DomainLibType = "domain" | "application" | "infra" | "ui";

export interface DomainLibGeneratorSchema {
	name: string;
	type: DomainLibType;
	scope: string;
}
