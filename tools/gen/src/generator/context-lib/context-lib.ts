import { Tree } from "@nx/devkit";
import domainLibGenerator from "../domain-lib/domain-lib";
import { DomainLibGeneratorSchema } from "../domain-lib/schema";
import { ContextLibGeneratorSchema } from "./schema";

export async function contextLibGenerator(
	tree: Tree,
	options: ContextLibGeneratorSchema,
) {
	const types = ["domain", "feature", "infra", "ui", "app"];

	for (const type of types) {
		const domainLibOptions: DomainLibGeneratorSchema = {
			scope: options.context,
			name: type,
			type,
		};

		await domainLibGenerator(tree, domainLibOptions);
	}
}

export default contextLibGenerator;
