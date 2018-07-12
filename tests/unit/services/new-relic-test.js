import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import td from "testdouble";

import { SUPPORTED_METHODS } from "ember-new-relic/services/new-relic";

let tempNreum;

module("Unit | Service | new relic", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(() => {
    tempNreum = window.NREUM;
  });

  hooks.afterEach(() => {
    window.NREUM = tempNreum;
    tempNreum = undefined;

    td.reset();
  });

  test("it can initialize without a New Relic global", function(assert) {
    window.NREUM = undefined;

    let service = this.owner.lookup("service:new-relic");
    assert.ok(service);

    // Ensure that calling methods works without the New Relic global
    for (const method of SUPPORTED_METHODS) {
      service[method]();
    }
  });

  test("it can proxy methods to the New Relic global", function(assert) {
    assert.expect(SUPPORTED_METHODS.length);

    window.NREUM = {};
    for (const method of SUPPORTED_METHODS) {
      window.NREUM[method] = td.function();
    }

    let service = this.owner.lookup("service:new-relic");
    for (const method of SUPPORTED_METHODS) {
      service[method]();
      assert.verify(window.NREUM[method]());
    }
  });
});
