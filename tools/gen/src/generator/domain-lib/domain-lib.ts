import {
	formatFiles,
	generateFiles,
	readProjectConfiguration,
	updateProjectConfiguration,
	type Tree,
} from "@nx/devkit";
import * as path from "path";
import type { DomainLibGeneratorSchema } from "./schema";
// @ts-expect-error - Node10 can't see exports-map subpaths
import {
	applicationGenerator as angularApplicationGenerator,
	libraryGenerator as angularLibraryGenerator,
	UnitTestRunner,
} from "@nx/angular/generators";
import { libraryGenerator as baseLibraryGenerator } from "@nx/js";

const ANGULAR_APPLICATION_LAYER = new Set(["app"]);
const ANGULAR_LIBRARY_LAYER = new Set(["ui", "feature"]);

export async function domainLibGenerator(
	tree: Tree,
	options: DomainLibGeneratorSchema,
) {
	const projectRoot = `libs/${options.scope}/${options.name}`;
	const projectName = `${options.scope}/${options.name}`;
	if (ANGULAR_LIBRARY_LAYER.has(options.type)) {
		await angularLibraryGenerator(tree, {
			name: projectName,
			directory: projectRoot,
			linter: "eslint",
			unitTestRunner: UnitTestRunner.VitestAnalog,
		});
	} else if (ANGULAR_APPLICATION_LAYER.has(options.type)) {
		await angularApplicationGenerator(tree, {
			name: projectName,
			directory: projectRoot,
			linter: "eslint",
			unitTestRunner: UnitTestRunner.VitestAnalog,
		});
	} else {
		await baseLibraryGenerator(tree, {
			name: projectName,
			directory: projectRoot,
			linter: "eslint",
			unitTestRunner: "vitest",
		});
	}

	updateProjectConfiguration(tree, projectName, {
		...readProjectConfiguration(tree, projectName),
		tags: [`type:${options.type}`, `scope:${options.scope}`],
	});

	generateFiles(tree, path.join(__dirname, "files"), projectRoot, options);
	await formatFiles(tree);
}

export default domainLibGenerator;
