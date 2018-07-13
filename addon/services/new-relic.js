import Service from '@ember/service';

const REGULAR_METHODS = [
  'addPageAction',
  'addRelease',
  'addToTrace',
  'finished',
  'noticeError',
  'setCustomAttribute',
  'setErrorHandler',
  'setPageViewName',
  'createTimer',
  'setCurrentRouteName'
];

const INTERACTION_RETURNING_METHODS = [
  'end',
  'getContext',
  'ignore',
  'interaction',
  'onEnd',
  'save',
  'setAttribute',
  'setName'
];

// Method Reference:
// https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api
export const SUPPORTED_METHODS = [
  ...REGULAR_METHODS,
  ...INTERACTION_RETURNING_METHODS
];

class FakeBrowserInteractionEvent {
  constructor() {
    for (const method of INTERACTION_RETURNING_METHODS) {
      this[method] = stubbedInteractionMethod;
    }
  }
}

const stubbedRegularMethod = function() {
  // This method has been stubbed out because the New Relic global is not available
};

const stubbedInteractionMethod = function() {
  // This method has been stubbed out because the New Relic global is not available
  return new FakeBrowserInteractionEvent();
};

export default Service.extend({
  init() {
    this._super(...arguments);

    const { NREUM } = window;

    for (const method of REGULAR_METHODS) {
      this[method] = NREUM ? NREUM[method].bind(NREUM) : stubbedRegularMethod;
    }

    for (const method of INTERACTION_RETURNING_METHODS) {
      this[method] = NREUM
        ? NREUM[method].bind(NREUM)
        : stubbedInteractionMethod;
    }
  }
});
