import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Application from '@ember/application';
import { run } from '@ember/runloop';
import NewRelicInitializer from '../../../instance-initializers/new-relic';

let application;

module('Unit | Initializer | new relic', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(() => {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  // Replace this with your real tests.
  test('it works', function(assert) {
    NewRelicInitializer.initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
