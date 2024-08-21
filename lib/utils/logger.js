import chalk from "chalk";
import { performance } from "perf_hooks";
import figures from "figures";

const startTime = performance.now();

const formatElapsedTime = () => {
	const elapsed = performance.now() - startTime;
	const seconds = (elapsed / 1000).toFixed(2);
	return chalk.bgGreen.black(`[+${seconds}s]`);
};
const appName = () => {
	return chalk.bgBlue.black("[helix]");
};
const logger = {
	info(message) {
		console.log(
			`${formatElapsedTime()} : ${appName()} ${chalk.blue(`${figures.info} [INFO] ${message}`)}`,
		);
	},

	success(message) {
		console.log(
			`${formatElapsedTime()} : ${appName()} ${chalk.green(`${figures.tick} [SUCCESS] ${message}`)}`,
		);
	},

	error(message) {
		console.log(
			`${formatElapsedTime()} : ${appName()} ${chalk.red(`${figures.cross} [ERROR] ${message}`)}`,
		);
	},
};

export default logger;
