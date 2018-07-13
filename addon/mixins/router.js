import Mixin from "@ember/object/mixin";
import { inject as service } from "@ember/service";
import { get } from "@ember/object";

/**
 * To be mixed into the application's router
 *
 * Sets the current route name on each transition
 */
export default Mixin.create({
  newRelic: service("new-relic"),

  didTransition() {
    this._super(...arguments);

    const routeName = get(this, "currentRouteName");

    get(this, "newRelic").setCurrentRouteName(routeName);
  }
});
