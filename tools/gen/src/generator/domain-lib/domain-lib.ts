import {
	addProjectConfiguration,
	formatFiles,
	generateFiles,
	readProjectConfiguration,
	updateProjectConfiguration,
	type Tree,
} from "@nx/devkit";
import * as path from "path";
import type { DomainLibGeneratorSchema } from "./schema";
import { libraryGenerator } from "@nx/js";

export async function domainLibGenerator(
	tree: Tree,
	options: DomainLibGeneratorSchema,
) {
	const projectRoot = `libs/${options.name}`;
	const projectName = options.name;

	await libraryGenerator(tree, {
		name: projectName,
		directory: projectRoot,
	});

	updateProjectConfiguration(tree, projectName, {
		...readProjectConfiguration(tree, projectName),
		tags: [`type:${options.type}`, `scope:${options.scope}`],
	});

	generateFiles(tree, path.join(__dirname, "files"), projectRoot, options);
	await formatFiles(tree);
}

export default domainLibGenerator;
