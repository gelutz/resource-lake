import nx from "@nx/eslint-plugin";

export default [
	...nx.configs["flat/base"],
	...nx.configs["flat/typescript"],
	...nx.configs["flat/javascript"],
	{
		ignores: ["**/dist", "**/out-tsc", "**/vitest.config.*.timestamp*"],
	},
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
		rules: {
			"@nx/enforce-module-boundaries": [
				"error",
				{
					enforceBuildableLibDependency: true,
					allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"],
					depConstraints: [
						{
							sourceTag: "scope:resources",
							onlyDependOnLibsWithTags: ["scope:resources", "scope:shared"],
						},
						{
							sourceTag: "scope:shared",
							onlyDependOnLibsWithTags: ["scope:shared"],
						},
						{
							sourceTag: "type:app",
							onlyDependOnLibsWithTags: [
								"type:ui",
								"type:feature",
								"type:domain",
								"type:util",
							],
						},
						{
							sourceTag: "type:ui",
							onlyDependOnLibsWithTags: [
								"type:feature",
								"type:domain",
								"type:util",
							],
						},
						{
							sourceTag: "type:infra",
							onlyDependOnLibsWithTags: [
								"type:feature",
								"type:domain",
								"type:util",
							],
						},
						{
							sourceTag: "type:feature",
							onlyDependOnLibsWithTags: ["type:domain", "type:util"],
						},
						{
							sourceTag: "type:domain",
							onlyDependOnLibsWithTags: ["type:util"],
						},
					],
				},
			],
		},
	},
	{
		files: [
			"**/*.ts",
			"**/*.tsx",
			"**/*.cts",
			"**/*.mts",
			"**/*.js",
			"**/*.jsx",
			"**/*.cjs",
			"**/*.mjs",
		],
		// Override or add rules here
		rules: {},
	},
	{
		files: ["**/*.json"],
		// Override or add rules here
		rules: {},
		languageOptions: {
			parser: await import("jsonc-eslint-parser"),
		},
	},
];
