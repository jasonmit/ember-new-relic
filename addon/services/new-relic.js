import Service from '@ember/service';

// Method Reference:
// https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api
export const SUPPORTED_METHODS = [
  'addPageAction',
  'addRelease',
  'addToTrace',
  'finished',
  'interaction',
  'noticeError',
  'setCurrentRouteName',
  'setCustomAttribute',
  'setErrorHandler',
  'setPageViewName'
];

const INTERACTION_METHODS = [
  'createTracer',
  'end',
  'getContext',
  'ignore',
  'onEnd',
  'save',
  'setAttribute',
  'setName'
];

class FakeBrowserInteractionEvent {
  constructor() {
    for (const method of INTERACTION_METHODS) {
      this[method] =
        method === 'createTracer'
          ? (_name, cb) => cb
          : stubbedInteractionMethod;
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

    for (const method of SUPPORTED_METHODS) {
      this[method] = NREUM
        ? NREUM[method].bind(NREUM)
        : method === 'interaction'
          ? () => new FakeBrowserInteractionEvent()
          : stubbedRegularMethod;
    }
  }
});
