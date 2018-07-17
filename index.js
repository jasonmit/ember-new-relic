'use strict';

const fs = require('fs');
const path = require('path');
const replace = require('broccoli-string-replace');

module.exports = {
  name: 'ember-metrics-new-relic',

  included() {
    this._super.included.call(this, ...arguments);

    const snippetBuffer = fs.readFileSync(
      path.resolve(__dirname, 'new-relic-snippets/pro-spa.js')
    );

    if (snippetBuffer) {
      this.snippet = snippetBuffer.toString();
    } else {
      throw new Error('Could not read New Relic snippet');
    }
  },

  treeForAddon(tree) {
    const superTree = this._super.treeForAddon.call(this, tree);

    const treeWithSnippet = replace(superTree, {
      files: [`${this.name}/metrics-adapters/new-relic.js`],
      pattern: {
        match: /NEW_RELIC_SNIPPET/g,
        replacement: this.snippet
      }
    });

    return treeWithSnippet;
  }
};
