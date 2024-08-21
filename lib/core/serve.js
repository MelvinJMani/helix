import chokidar from "chokidar";
import debounce from "lodash.debounce";
import fse from "fs-extra";
import server from "../utils/server.js";
import log from "../utils/logger.js";
import build from "./build.js";
import parseOptions from "../utils/parser.js";

/**
 * Serve the site in watch mode
 */
const serve = async (options, flags) => {
	try {
		log.info(`Starting local server at http://localhost:${flags.port}`);

		const { srcPath, outputPath } = parseOptions(options);

		// clear destination folder
		fse.emptyDirSync(outputPath);

		// Initial build
		await build(options);

		// Start the server
		server.serve({ path: outputPath, port: flags.port });

		// Watch for changes
		const watcher = chokidar.watch(srcPath, { ignoreInitial: true });
		const onChange = debounce(async () => {
			try {
				await build(options);
				log.info("Build updated.");
			} catch (err) {
				log.error("Build failed:", err.message);
			}
		}, 500);

		watcher.on("all", () => {
			onChange(); // debounce calls build function
			log.info("Waiting for changes...");
		});
	} catch (error) {
		log.error("Failed to start server or build site:", error.message);
	}
};

export default serve;
