import path from "path";
import helix from "../index.js";
import log from "../utils/logger.js";
import { pathToFileURL } from "url";

const VALID_COMMANDS = new Set(["init", "start", "build"]);

const cliProcess = async (input = [], flags = {}) => {
	try {
		// Destructure flags for easier use
		const { config } = flags;

		// Get command
		const command = input.length > 0 ? input[0] : null;

		if (!VALID_COMMANDS.has(command)) {
			log.error("Invalid command");
			return;
		}
		if (command === "init") {
			helix.init();
		} else {
			// Validate and load config file
			let configData = {};
			if (config) {
				const configPath = path.resolve(config);
				const configUrl = pathToFileURL(configPath).href;
				log.info(`Loading configuration from: ${configUrl}`);
				configData = await import(configUrl).then(
					(module) => module.default || module,
				);
				log.success("Configuration loaded");
			}
			if (command === "start") {
				helix.serve(configData, flags);
			} else if (command === "build") {
				helix.build(configData);
			}
		}
	} catch (err) {
		log.error(
			"Sorry, An unexpected error occured. Try again later. Details :" +
				err.message,
		);
		return;
	}
};

export default cliProcess;
