import fse from 'fs-extra';
import { expect } from 'chai';
import mockConfig from '../mock/mock-config.cjs';
import build from '../../lib/core/build.js'; 

describe('build', function() {
  const _build = mockConfig.build;

  it('1. should copy assets folder', function() {
    // when
    build(mockConfig);

    // then
    expect(fse.existsSync(`${_build.outputPath}/asset.txt`)).to.be.true;
    expect(fse.existsSync(`${_build.outputPath}/sub/another.txt`)).to.be.true;
  });

  it('2. should use the default layout', function() {
    // when
    build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${_build.outputPath}/md1/index.html`,
      'utf-8'
    );
    expect(page).to.have.string('default-layout-start');
    expect(page).to.have.string('default-layout-end');
  });

  it('3. should use custom layout', function() {
    // when
    build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${_build.outputPath}/custom/index.html`,
      'utf-8'
    );
    expect(page).to.have.string('custom-layout-start');
    expect(page).to.have.string('custom-layout-end');
    expect(page).to.have.string('<p>custom-layout-page</p>');
  });

  it('4. should generate pages from markdown', function() {
    // when
    build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${_build.outputPath}/md1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>markdown-page-1</p>');

    const page2 = fse.readFileSync(
      `${_build.outputPath}/md/md2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>markdown-page-2</p>');
  });

  it('5. should generate pages from ejs', function() {
    // when
    build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${_build.outputPath}/ejs1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>ejs-1</p>');

    const page2 = fse.readFileSync(
      `${_build.outputPath}/ejs/ejs2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>ejs-2</p>');
  });

  it('6. should generate pages from html', function() {
    // when
    build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${_build.outputPath}/html1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>html-1</p>');

    const page2 = fse.readFileSync(
      `${_build.outputPath}/html/html2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>html-2</p>');
  });

  it('7. should not generate extra directory if filename is index', function() {
    // when
    build(mockConfig);

    // then
    expect(
      fse.existsSync(
        `${_build.outputPath}/with-index/index/index.html`
      )
    ).to.be.false;
    expect(
     fse.existsSync(`${_build.outputPath}/with-index/index.html`)
    ).to.be.true;
  });

  it('8. should not generate extra directory if cleanUrls option is false', function() {
    // when
    const config = Object.assign({}, mockConfig);
    config.build = Object.assign({}, config.build, { cleanUrls: false });
    build(config);

    // then
    expect(fse.existsSync(`${_build.outputPath}/html1.html`)).to.be.true;
  });

  it('9. should inject site config', function() {
    // when
    build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${_build.outputPath}/with-site-data/index.html`,
      'utf-8'
    );
    expect(page).to.have.string('site title on layout: test-site');
    expect(page).to.have.string('site title on page: test-site');
  });

  it('10. should inject front matter', function() {
    // when
    build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${_build.outputPath}/with-front-matter-md/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('front-matter on layout: test-md');

    const page2 = fse.readFileSync(
      `${_build.outputPath}/with-front-matter-ejs/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('front-matter on layout: test-ejs');
    expect(page2).to.have.string('front-matter on page: test-ejs');
  });

  it('11. should include partial on layout', function() {
    // when
    build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${_build.outputPath}/ejs1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>test-partial-from-layout</p>');
  });

  it('12. should include partial on pages', function() {
    // when
    build(mockConfig);

    // then
    const page1 = fse.readFileSync(
      `${_build.outputPath}/ejs1/index.html`,
      'utf-8'
    );
    expect(page1).to.have.string('<p>test-partial-from-page-ejs1</p>');

    const page2 = fse.readFileSync(
      `${_build.outputPath}/ejs/ejs2/index.html`,
      'utf-8'
    );
    expect(page2).to.have.string('<p>test-partial-from-page-ejs2</p>');
  });

  it('13. should sanitize page content using DOMPurify', function() {
    // when
    build(mockConfig);
  
    // then
    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-script/index.html`,
      'utf-8'
    );
    
    // Check for sanitized content
    expect(page2).to.not.have.string('<script>alert("XSS")</script>');
    expect(page2).to.have.string('<p>html-with-script</p>');
  });

  it('14. should use custom layout with EJS page', function() {
    // when
    build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/custom-layout/index.html`,
      'utf-8'
    );
    expect(page).to.have.string('custom-layout-start');
    expect(page).to.have.string('custom-layout-end');
    expect(page).to.have.string('Custom layout with ejs page');
  });

  it('15. should create sitemap.xml', function() {
    // when
    build(mockConfig);
    const fileExist = fse.existsSync(`${mockConfig.build.outputPath}/sitemap.xml`)
    // then
    expect(fileExist).to.be.true;
  });

  it('16. should inject relative URL path', function() {
    // when
    build(mockConfig);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-url-path/index.html`,
      'utf-8'
    );
    expect(page).to.have.string('relative URL: /with-url-path/');
  });

  it('17. should inject relative URL path without clean URLs', function() {
    // when
    const config = Object.assign({}, mockConfig);
    config.build = Object.assign({}, config.build, { cleanUrls: false });
    build(config);

    // then
    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-url-path.html`,
      'utf-8'
    );
    expect(page).to.have.string('relative URL: /with-url-path.html');
  });

});