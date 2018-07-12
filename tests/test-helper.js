import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';

import 'ember-cli-testdouble-qunit';

setResolver(resolver);
start();
