import { get } from "@ember/object";
import { isNone } from "@ember/utils";
import Ember from "ember";
import { on } from "rsvp";

export function initialize() {
  const { NREUM } = window;

  if (!NREUM) {
    return;
  }

  function mustIgnoreError(error) {
    // Ember 2.X seems to not catch `TransitionAborted` errors caused by regular redirects. We don't want these errors to show up in NewRelic so we have to filter them ourselfs.
    // Once the issue https://github.com/emberjs/ember.js/issues/12505 is resolved we can remove this ignored error.
    if (isNone(error)) {
      return false;
    }
    const errorName = get(error, "name");
    return errorName === "TransitionAborted";
  }

  function handleError(error, shouldThrowError = true) {
    if (mustIgnoreError(error)) {
      return;
    }

    try {
      NREUM.noticeError(error);
    } catch (e) {
      // Ignore
    }

    // Ensure we don't throw errors with `Logger.error`
    if (Ember.testing && shouldThrowError) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.error(error);
  }

  function generateError(cause, stack) {
    const error = new Error(cause);

    error.stack = stack;

    return error;
  }

  Ember.onerror = handleError;

  on("error", handleError);

  Ember.Logger.error = function(...messages) {
    handleError(generateError(messages.join(" ")), false);
  };
}

export default {
  name: "new-relic",
  initialize
};
