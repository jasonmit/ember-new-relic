import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import td from 'testdouble';

import {
  createMockGlobal,
  preserveGlobalNewRelic
} from '../../helpers/mock-new-relic';
import { SUPPORTED_METHODS } from 'ember-metrics-new-relic/services/new-relic';

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

  module('with the New Relic global', function(hooks) {
    hooks.beforeEach(function() {
      window.NREUM = createMockGlobal();
    });

    test('it proxies methods to the New Relic global', function(assert) {
      assert.expect(SUPPORTED_METHODS.length);

      let service = this.owner.lookup('service:new-relic');

      for (const method of SUPPORTED_METHODS) {
        service[method]();
        assert.verify(window.NREUM[method]());
      }
    });

    test('it can configure the New Relic global', function(assert) {
      let service = this.owner.lookup('service:new-relic');
      service.set('info', { foo: 'bar' });

      assert.deepEqual(
        window.NREUM.info,
        { foo: 'bar' },
        'It sets the info on the New Relic global'
      );
      assert.deepEqual(
        service.get('info'),
        { foo: 'bar' },
        'The config can be read from the service'
      );
    });

    test('it can remove the New Relic global', function(assert) {
      window.NREUM = createMockGlobal();

      let service = this.owner.lookup('service:new-relic');
      service.destroyNREUM();

      assert.notOk(window.NREUM);
    });
  });
});
