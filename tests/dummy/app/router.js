import EmberRouter from '@ember/routing/router';
import config from './config/environment';

import NewRelicRouterMixin from 'ember-metrics-new-relic/mixins/router';

const Router = EmberRouter.extend(NewRelicRouterMixin, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {});

export default Router;
