import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import td from 'testdouble';

import {
  createMockGlobal,
  preserveGlobalNewRelic
} from '../../helpers/mock-new-relic';
import { SUPPORTED_METHODS } from 'ember-new-relic/services/new-relic';

module('Unit | Service | new relic', function(hooks) {
  setupTest(hooks);
  preserveGlobalNewRelic(hooks);

  hooks.afterEach(() => {
    td.reset();
  });

  module('without the New Relic global', function(hooks) {
    hooks.beforeEach(function() {
      window.NREUM = undefined;
    });

    test('it stubs out the New Relic global methods', function(assert) {
      let service = this.owner.lookup('service:new-relic');
      assert.ok(service);

      // Ensure that calling methods works without the New Relic global
      for (const method of SUPPORTED_METHODS) {
        service[method]();
      }
    });

    test('it can chain Interaction-returning methods', function(assert) {
      assert.expect(0);

      let service = this.owner.lookup('service:new-relic');

      service
        .interaction()
        .setAttribute()
        .setAttribute();
    });
  });

  module('with the New Relic global', function() {
    test('it proxies methods to the New Relic global', function(assert) {
      assert.expect(SUPPORTED_METHODS.length);

      window.NREUM = createMockGlobal();

      let service = this.owner.lookup('service:new-relic');
      for (const method of SUPPORTED_METHODS) {
        service[method]();
        assert.verify(window.NREUM[method]());
      }
    });
  });
});
