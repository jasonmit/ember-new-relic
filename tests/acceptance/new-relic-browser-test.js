import Ember from "ember";
import { module, test } from "qunit";
import { setupApplicationTest } from "ember-qunit";
import { visit } from "@ember/test-helpers";
import td from "testdouble";

import {
  createMockGlobal,
  preserveGlobalNewRelic
} from "../helpers/mock-new-relic";

module("Acceptance | new relic browser", function(hooks) {
  setupApplicationTest(hooks);
  preserveGlobalNewRelic(hooks);

  hooks.beforeEach(() => {
    window.NREUM = createMockGlobal();
  });

  hooks.afterEach(() => {
    td.reset();
  });

  test("Loading New Relic Browser", async function(assert) {
    await visit("/");

    const error = new Error("Awh crap");
    assert.throws(() => {
      Ember.onerror(error);
    }, "Awh crap");
    assert.verify(window.NREUM.noticeError(error));

    const transitionError = new Error("Ember Transition Aborted Test");
    transitionError.name = "TransitionAborted";
    Ember.onerror(transitionError);

    assert.equal(
      td.explain(window.NREUM.noticeError).callCount,
      1,
      "Was not called for the `transitionError`"
    );

    Ember.Logger.error("Whoops", "We done messed up", {});

    assert.equal(
      td.explain(window.NREUM.noticeError).callCount,
      2,
      "Was called when logging an error"
    );
  });

  test("console.error from Ember.Logger.error correctly shows messages", async function(assert) {
    await visit("/");

    // eslint-disable-next-line no-console
    console.error = function(message) {
      assert.strictEqual(
        message.toString(),
        "Error: Whoops We done messed up",
        "Shows messages space-separated"
      );
    };

    Ember.Logger.error("Whoops", "We done messed up");
  });

  test("Route Mixin: tells New Relic when a route changes", async function(assert) {
    await visit("/");

    assert.verify(window.NREUM.setCurrentRouteName("index"));
  });
});
