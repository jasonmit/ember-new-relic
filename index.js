'use strict';

const fs = require('fs');
const path = require('path');
const replace = require('broccoli-string-replace');

module.exports = {
  name: 'ember-metrics-new-relic',

  treeForAddon(tree) {
    const superTree = this._super.treeForAddon.call(this, tree);

    const spaSnippet = fs.readFileSync(
      path.resolve(__dirname, 'new-relic-snippets/pro-spa.js')
    );

    const treeWithSnippet = replace(superTree, {
      files: ['metrics-adapters/new-relic.js'],
      pattern: {
        match: /NEW_RELIC_SNIPPET/g,
        replacement: spaSnippet
      }
    });

    return treeWithSnippet;
  }
};
