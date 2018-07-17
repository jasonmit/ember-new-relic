import { module, test } from 'qunit';

import { SNIPPET } from 'ember-metrics-new-relic/metrics-adapters/new-relic';

module('Unit | Utility | new-relic-snippet', function() {
  test('it imports the SPA New Relic config', function(assert) {
    assert.notEqual(SNIPPET, 'NEW_RELIC_SNIPPET');
  });
});
