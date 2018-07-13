const fs = require('fs');
const path = require('path');
const broccoli = require('broccoli');
const EmberNewRelic = require('../index.js');

const { module: describe, test } = QUnit;

describe("When config['ember-new-relic'].spaMonitoring is false", function(hooks) {
  hooks.beforeEach(function() {
    EmberNewRelic.isValidNewRelicConfig = false;
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
      spaMonitoring: false,
      applicationId: 'test application ID',
      licenseKey: 'test license key'
    });
  });

  test('wantsSPAMonitoring(newRelicConfig) returns false', function(assert) {
    assert.equal(EmberNewRelic.wantsSPAMonitoring(this.newRelicConfig), false);
  });

  test('getNewRelicTrackingCode returns classicTrackingCode', function(assert) {
    assert.equal(
      EmberNewRelic.getNewRelicTrackingCode(this.newRelicConfig),
      EmberNewRelic.classicTrackingCode(this.newRelicConfig)
    );
  });
});

describe("When config['ember-new-relic'].spaMonitoring is true", function(hooks) {
  hooks.beforeEach(function() {
    EmberNewRelic.isValidNewRelicConfig = false;
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
      spaMonitoring: true,
      applicationId: 'test application ID',
      licenseKey: 'test license key',
      agent: 'js-agent.newrelic.com/nr-spa-963.min.js'
    });
  });

  test('contentFor head-footer returns script tag with src to outputPath if importToVendor option is false and newRelicConfig is valid', function(assert) {
    var newRelicConfigAfterRemovingOurCustomConfig = Object.assign(
      {},
      this.newRelicConfig
    );
    delete newRelicConfigAfterRemovingOurCustomConfig.spaMonitoring;

    var original = EmberNewRelic.spaTrackingCode;
    EmberNewRelic.spaTrackingCode = function() {
      return 'spa!';
    };

    EmberNewRelic.newRelicConfig = this.newRelicConfig;
    EmberNewRelic.importToVendor = false;
    EmberNewRelic.isValidNewRelicConfig = false;

    try {
      assert.equal(EmberNewRelic.contentFor('head-footer'), undefined);

      EmberNewRelic.isValidNewRelicConfig = true;
      assert.equal(
        EmberNewRelic.contentFor('head-footer'),
        EmberNewRelic.asScriptTag(EmberNewRelic.outputPath)
      );
    } finally {
      EmberNewRelic.spaTrackingCode = original;
    }
  });

  test('wantsSPAMonitoring(newRelicConfig) returns true', function(assert) {
    assert.equal(EmberNewRelic.wantsSPAMonitoring(this.newRelicConfig), true);
  });

  test('getNewRelicTrackingCode returns spaTrackingCode', function(assert) {
    assert.equal(
      EmberNewRelic.getNewRelicTrackingCode(this.newRelicConfig),
      EmberNewRelic.spaTrackingCode(this.newRelicConfig)
    );
  });
});

describe('When outputPath, applicationId, and licenseKey are defined', function(hooks) {
  hooks.beforeEach(function() {
    EmberNewRelic.isValidNewRelicConfig = false;
    this.newRelicConfig = EmberNewRelic.getNewRelicConfig({
      spaMonitoring: true,
      applicationId: 'test application ID',
      licenseKey: 'test license key',
      agent: 'js-agent.newrelic.com/nr-spa-963.min.js'
    });
  });

  test('writeTrackingCodeTree returns a tree containing a file that has the tracking code when newRelicConfig is valid', function(assert) {
    var newRelicConfig = (EmberNewRelic.newRelicConfig = this.newRelicConfig);
    var tree = EmberNewRelic.writeTrackingCodeTree();
    var builder;

    // Tree should be undefined
    assert.equal(tree, undefined);

    // When NewRelicConfig is valid, tree will be `ok`.
    EmberNewRelic.isValidNewRelicConfig = true;
    tree = EmberNewRelic.writeTrackingCodeTree();

    assert.ok(tree);

    builder = new broccoli.Builder(tree);

    return builder.build().then(function(results) {
      var contents;

      contents = fs.readFileSync(
        path.join(results.directory, EmberNewRelic.outputPath),
        'utf-8'
      );
      assert.equal(
        contents,
        EmberNewRelic.getNewRelicTrackingCode(newRelicConfig)
      );
    });
  });
});
