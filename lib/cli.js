#!/usr/bin/env node
import chalk from "chalk";
import meow from "meow";
import cliProcess from "./core/cli-process.js";

const cli = meow(
	chalk`
    {yellow Initialize a new site:}

      {cyan $ helix-static-gen init}

    {yellow Start the current site:}

      {cyan $ helix-static-gen start [options]}

    {yellow Build the current site:}

      {cyan $ helix-static-gen build [options]}

    {underline {yellow Options}}
      {cyan -c, --config <file-path>}  Path to the config file (default: site.config.js)
      {cyan -p, --port <port-number>}  Port to use for local server (default: 3000)
      
      {cyan -h, --help}                Display this help text
      {cyan -v, --version}             Display Helix version
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
