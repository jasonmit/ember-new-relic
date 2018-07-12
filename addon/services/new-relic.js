import Ember from 'ember';

// Method Reference:
// https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api
export const SUPPORTED_METHODS = [
  'addPageAction',
  'addRelease',
  'addToTrace',
  'finished',
  'noticeError',
  'setCustomAttribute',
  'setErrorHandler',
  'setPageViewName',
  'createTimer',
  'end',
  'getContext',
  'ignore',
  'interaction',
  'onEnd',
  'save',
  'setAttribute',
  'setCurrentRouteName',
  'setName'
];

const stubbedMethod = function() {
  // This method has been stubbed out because the New Relic global is not available
}

export default Ember.Service.extend({
  init() {
    this._super(...arguments);

    const { NREUM } = window;

    for (const method of SUPPORTED_METHODS) {
      this[method] = NREUM
        ? NREUM[method].bind(NREUM)
        : stubbedMethod;
    }
  }
});
