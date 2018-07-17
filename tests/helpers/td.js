import td from 'testdouble';
import { run } from '@ember/runloop';

/**
 * Replace a service with a stubbed version of itself
 *
 * Each method on the service will be replaced with a TestDouble function
 *
 * @param {Owner} owner
 * @param {string} name the name of the service in the register
 * @return {Ember.Service} The stubbed version of the previously registered object
 */
export function stubService(owner, name) {
  const serviceName = `service:${name}`;
  const original = owner.lookup(serviceName);
  const replacement = td.object(original);

  run(() => {
    owner.unregister(serviceName);
    owner.register(serviceName, replacement, { instantiate: false });
  });

  return replacement;
}
