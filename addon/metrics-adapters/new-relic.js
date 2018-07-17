import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { assert } from '@ember/debug';

const CONFIG_DEFAULTS = {
  beacon: 'bam.nr-data.net',
  errorBeacon: 'bam.nr-data.net',
  sa: 1
};

// This will be replaced with the real snippet at build-time
export const SNIPPET = `NEW_RELIC_SNIPPET`;

export default BaseAdapter.extend({
  newRelic: service(),

  _scriptTag: undefined,

  toStringExtension() {
    return 'new-relic';
  },

  init() {
    const info = Object.assign({}, CONFIG_DEFAULTS, get(this, 'config'));
    const { licenseKey, applicationID } = info;

    assert(
      `[ember-metrics] You must pass a valid \`licenseKey\` to the ${this.toString()} adapter`,
      licenseKey
    );
    assert(
      `[ember-metrics] You must pass a valid \`applicationID\` to the ${this.toString()} adapter`,
      applicationID
    );

    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.innerHTML = SNIPPET;
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
    this._scriptTag = scriptTag;

    set(this, 'newRelic.info', info);
  },

  identify() {},

  trackEvent() {},

  trackPage() {},

  alias() {},

  willDestroy() {
    if (this._scriptTag) {
      this._scriptTag.parentElement.removeChild(this._scriptTag);
      this._scriptTag = undefined;

      get(this, 'newRelic').cleanup();
    }
  }
});
