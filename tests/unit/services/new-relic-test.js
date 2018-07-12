import { moduleFor, test } from 'ember-qunit';
import td from 'testdouble';

import { SUPPORTED_METHODS } from 'ember-new-relic/services/new-relic';

let tempNreum;

moduleFor('service:new-relic', 'Unit | Service | new relic', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo'],
  beforeEach() {
    tempNreum = window.NREUM;
  },

  afterEach() {
    window.NREUM = tempNreum;
    tempNreum = undefined;

    td.reset();
  }
});

test('it can initialize without a New Relic global', function(assert) {
  window.NREUM = undefined;

  let service = this.subject();
  assert.ok(service);

  // Ensure that calling methods works without the New Relic global
  for (const method of SUPPORTED_METHODS) {
    service[method]();
  }
});

test('it can proxy methods to the New Relic global', function(assert) {
  window.NREUM = {};
  for (const method of SUPPORTED_METHODS) {
    window.NREUM[method] = td.function();
  }

  let service = this.subject();
  for (const method of SUPPORTED_METHODS) {
    service[method]();
    assert.verify(window.NREUM[method]());
  }
});
