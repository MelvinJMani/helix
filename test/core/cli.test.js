import { expect } from 'chai';
import helix from '../../lib/index.js'; 
import cli from '../../lib/core/cli-process.js';
import mockConfig from '../mock/mock-config.cjs';


describe('cli-process', function() {
  let initStub, buildStub, serveStub;

  beforeEach(function() {
    initStub = helix.init = () => {};
    buildStub = helix.build = () => {};
    serveStub = helix.serve = () => {};
  });

  afterEach(function() {
    helix.init = initStub;
    helix.build = buildStub;
    helix.serve = serveStub;
  });

  it('1. should do nothing if missing or invalid command', () => {
    // when
    cli();

    // then
    expect(helix.init.called).to.be.undefined;
    expect(helix.build.called).to.be.undefined;
    expect(helix.serve.called).to.be.undefined;

    // when
    cli(['foo']);

    // then
    expect(helix.init.called).to.be.undefined;
    expect(helix.build.called).to.be.undefined;
    expect(helix.serve.called).to.be.undefined;
  });

  it('2. should initialize a new site', function() {
    // when
    let initCalled = false;
    helix.init = () => { initCalled = true; };
    cli(['init']);

    // then
    expect(initCalled).to.be.true;
  });

  it('3. should start site with default options', function() {
    // when
    let serveCalled = false;
    let serveArgs = [];
    helix.serve = (...args) => {
      serveCalled = true;
      serveArgs = args;
    };
    cli(['start']);

    // then
    expect(serveCalled).to.be.true;
    expect(serveArgs).to.deep.equal([{}, {}]);
  });

  it('4. should start site with custom options', async function() {
    // given
    const flags = { config: 'test/mock/mock-config.cjs', port: 1111 };

    // when
    let serveCalled = false;
    let serveArgs = [];
    helix.serve = (...args) => {
      serveCalled = true;
      serveArgs = args;
    };
    await cli(['start'], flags);

    // then
    expect(serveCalled).to.be.true;
    expect(serveArgs).to.deep.equal([mockConfig, flags]);
  });

  it('5. should build site with default options', function() {
    // when
    let buildCalled = false;
    let buildArgs = [];
    helix.build = (...args) => {
      buildCalled = true;
      buildArgs = args;
    };
    cli(['build']);

    // then
    expect(buildCalled).to.be.true;
    expect(buildArgs).to.deep.equal([{}]);
  });

  it('6. should build site with custom options', async function() {
    // given
    const flags = { config: 'test/mock/mock-config.cjs' };

    // when
    let buildCalled = false;
    let buildArgs = [];
    helix.build = (...args) => {
      buildCalled = true;
      buildArgs = args;
    };
    await cli(['build'], flags);

    // then
    expect(buildCalled).to.be.true;
    expect(buildArgs).to.deep.equal([mockConfig]);
  });
});
