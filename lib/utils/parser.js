const buildDefaults = {
    srcPath: './src',
    outputPath: './public',
    cleanUrls: true
  };
  
  /**
   * Parse options, setting the defaults on missing values
   */
  const parseOptions = (options = {}) => {
    const {
      srcPath = buildDefaults.srcPath,
      outputPath = buildDefaults.outputPath,
      cleanUrls = buildDefaults.cleanUrls
    } = options.build || {};
  
    const site = options.site || {};
  
    return { srcPath, outputPath, cleanUrls, site };
  };

  export default parseOptions ;