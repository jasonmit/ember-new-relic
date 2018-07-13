import td from "testdouble";
import { SUPPORTED_METHODS } from "ember-new-relic/services/new-relic";

// For some reason, `setToken` is not documented but is called by something
const ALL_METHODS = [...SUPPORTED_METHODS, "setToken"];

export function createMockGlobal() {
  const object = {};

  for (const method of ALL_METHODS) {
    object[method] = td.function(method);
  }

  return object;
}

export function preserveGlobalNewRelic(hooks) {
  let tempNreum;

  hooks.beforeEach(() => {
    tempNreum = window.NREUM;
  });

  hooks.afterEach(() => {
    window.NREUM = tempNreum;
    tempNreum = undefined;
  });
}
