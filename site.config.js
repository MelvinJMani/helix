const isProduction = process.env.NODE_ENV === 'production';

export default {
  build: {
    srcPath: './site',
    outputPath: './docs'
  },
  site: {
    title: 'Helix', 
    domain: isProduction ? 'https://melvinjmani.github.io/helix' : '',
    basePath: isProduction ? '/helix' : ''
  }
};
