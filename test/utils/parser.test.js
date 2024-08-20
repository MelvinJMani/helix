import { expect } from "chai";
import parseOptions from "../../lib/utils/parser.js";

describe("parseOptions", () => {
  it("1. should return default values when no options are provided", () => {
    const result = parseOptions();
    expect(result).to.deep.equal({
      srcPath: './src',
      outputPath: './public',
      cleanUrls: true,
      site: {}
    });
  });

  it("2. should return default values with partial overrides", () => {
    const options = {
      build: {
        srcPath: './custom-src'
      },
      site: { name: 'Test Site' }
    };
    const result = parseOptions(options);
    expect(result).to.deep.equal({
      srcPath: './custom-src',
      outputPath: './public',
      cleanUrls: true,
      site: { name: 'Test Site' }
    });
  });

  it("3. should return custom values when all options are provided", () => {
    const options = {
      build: {
        srcPath: './custom-src',
        outputPath: './custom-public',
        cleanUrls: false
      },
      site: { name: 'Test Site', theme: 'dark' }
    };
    const result = parseOptions(options);
    expect(result).to.deep.equal({
      srcPath: './custom-src',
      outputPath: './custom-public',
      cleanUrls: false,
      site: { name: 'Test Site', theme: 'dark' }
    });
  });

  it("4. should use default values when build key is not present", () => {
    const options = {
      site: { name: 'Test Site' }
    };
    const result = parseOptions(options);
    expect(result).to.deep.equal({
      srcPath: './src',
      outputPath: './public',
      cleanUrls: true,
      site: { name: 'Test Site' }
    });
  });
});
