import path from "path";
import fse from "fs-extra";
import cp, { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";
import enquirer from "enquirer";

import log from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { prompt } = enquirer;

const init = async () => {
	try {
		log.info("Initializing a new Helix site ...");
		log.info("Copying template files.");
		// Copy template files
		const templatePath = path.resolve(__dirname, "../../template");
		const destinationPath = ".";
		await fse.copy(templatePath, destinationPath);
		log.info("Template files copied.");
		// Ask user for package manager preference
		const { packageManager } = await prompt({
			type: "select",
			name: "packageManager",
			message: "Which package manager would you like to use?",
			choices: ["npm", "yarn"],
			initial: 0,
		});
		if (packageManager === "yarn") {
			cp.execSync("yarn init -y");
		} else if (packageManager === "npm") {
			cp.execSync("npm init -y");
		}
		log.info("Package.json initialized.");

		// Update package.json
		const packageJSONPath = path.resolve(__dirname, "../../package.json");
		const packageJSON = await fse.readJson(packageJSONPath);
		packageJSON.scripts = {
			...(packageJSON.scripts || {}),
			"start": "helix-static-gen start",
			"build": "cross-env NODE_ENV=development helix-static-gen build",
			"build:prod": "cross-env NODE_ENV=production helix-static-gen build",
		};
		await fse.writeJson(packageJSONPath, packageJSON, { spaces: 2 });
		log.info("Scripts added to package.json.");

		// Install dependencies
		const spinner = ora("Installing dependencies...").start();
		await new Promise((resolve, reject) => {
			let command = "";
			if (packageManager === "yarn") {
				command = "yarn add --dev helix-static-gen --loglevel error";
			} else {
				command = "npm i -D helix-static-gen --loglevel error";
			}
			cp.exec(command, (error) => {
				if (error) {
					spinner.fail("Failed to install dependencies.");
					log.error(`Error. Details ${error.message}`);
					reject(error);
				} else {
					spinner.succeed("Dependencies installed.");
					resolve();
				}
			});
		});

		log.success("Site initialized successfully!");
		log.info(
			`Run ${chalk.cyan(packageManager === "yarn" ? "yarn start" : "npm start")} to start your new site in your browser.`,
		);
		log.info(
			`Run ${chalk.cyan(packageManager === "yarn" ? "yarn build" : "npm run build")} to build it into the destination folder.`,
		);
	} catch (error) {
		log.error(`An error occurred during initialization: ${error.message}`);
	}
};

export default init;
