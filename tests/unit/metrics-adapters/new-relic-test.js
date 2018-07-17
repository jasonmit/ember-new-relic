import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { stubService } from 'ember-metrics-new-relic/tests/helpers/td';

module('Unit | Metrics Adapter | new-relic', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.newRelic = stubService(this.owner, 'new-relic');
    this.subject = this.owner.lookup('metrics-adapter:new-relic');
  });

  module('trackEvent', function() {
    test('tells New Relic about a page action', function(assert) {
      this.subject.trackEvent({ event: 'eventName', foo: 'bar' });

      assert.verify(this.newRelic.addPageAction('eventName', { foo: 'bar' }));
    });
  });

  module('identify', function() {
    test("it tells New Relic about the user's email address", function(assert) {
      this.subject.identify({ email: 'foo@bar.com' });

      assert.verify(
        this.newRelic.setCustomAttribute('username', 'foo@bar.com')
      );
    });
  });

  module('trackPage', function() {
    test('it tells New Relic the name of the new route', function(assert) {
      this.subject.trackPage({ title: 'index' });

      assert.verify(this.newRelic.setCurrentRouteName('index'));
    });
  });
});
