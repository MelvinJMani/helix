import { expect } from "chai";
import chalk from "chalk";
import figures from "figures";
import logger from "../../lib/utils/logger.js";


describe("Logger", () => {
  let originalConsoleLog;
  let loggedOutput;

  beforeEach(() => {
    // Save the original console.log function
    originalConsoleLog = console.log;

    // Override console.log to capture output
    console.log = (message) => {
      loggedOutput = message;
    };
  });

  afterEach(() => {
    // Restore the original console.log function
    console.log = originalConsoleLog;
    
    loggedOutput = null; // Clear logged output after each test
  });

  it("1. should log info messages correctly", () => {
    logger.info("This is an info message");
    
    expect(loggedOutput).to.include(`${figures.info} [INFO] This is an info message`);
    expect(loggedOutput).to.include('[helix]');
  });

  it("2. should log success messages correctly", () => {
    logger.success("This is a success message");

    // Verify the correct output
    expect(loggedOutput).to.include(chalk.green(`${figures.tick} [SUCCESS] This is a success message`));
    expect(loggedOutput).to.include(chalk.bgBlue.black('[helix]'));
  });

  it("3. should log error messages correctly", () => {
    logger.error("This is an error message");

    // Verify the correct output
    expect(loggedOutput).to.include(chalk.red(`${figures.cross} [ERROR] This is an error message`));
    expect(loggedOutput).to.include(chalk.bgBlue.black('[helix]'));
  });

  it("4. should include elapsed time in the log", () => {
    logger.info("Checking elapsed time");

    // Verify that the elapsed time part of the log exists
    expect(loggedOutput).to.match(/\[\+\d+\.\d+s\]/); // Matches something like [+0.12s]
  });
});
