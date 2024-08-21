#!/usr/bin/env node
import chalk from "chalk";
import meow from "meow";
import cliProcess from "./core/cli-process.js";

const cli = meow(
	`
	${chalk.yellow("Initialize a new site:")} ${chalk.cyan("$ helix-static-gen init")}

	${chalk.yellow("Start the current site:")} ${chalk.cyan("$ helix-static-gen start [options]")}

	${chalk.yellow("Build the current site:")} ${chalk.cyan("$ helix-static-gen build [options]")}

	${chalk.underline.yellow("Options")}

    	${chalk.cyan("-c, --config <file-path>")} Path to the config file [default: site.config.js]

    	${chalk.cyan("-p, --port <port-number>")} Port to use for local server [default: 3000]
	  
		${chalk.cyan("-h, --help")} Display this help text
	 
		${chalk.cyan("-v, --version")} Display Helix version
  `,
	{
		importMeta: import.meta, // Ensure to add this option
		flags: {
			config: {
				type: "string",
				default: "site.config.js",
				shortFlag: "c",
			},
			port: {
				type: "string",
				default: "3000",
				shortFlag: "p",
			},
			help: {
				type: "boolean",
				shortFlag: "h",
			},
			version: {
				type: "boolean",
				shortFlag: "v",
			},
		},
	},
);

cliProcess(cli.input, cli.flags);
