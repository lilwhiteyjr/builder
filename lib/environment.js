"use strict";

/**
 * Environment enhancements.
 *
 * We augment the current environment with additional paths to encompass
 * Builder paths.
 */
var path = require("path");

// OS-agnostic path delimiter.
var DELIM = process.platform.indexOf("win") === 0 ? ";" : ":";

// Node directories.
var CWD_BIN = path.join(process.cwd(), "node_modules/.bin");
var CWD_NODE_PATH = path.join(process.cwd(), "node_modules");

/**
 * Environment wrapper.
 *
 * **NOTE - Side Effects**: Mutates wrapped environment object.
 *
 * @param {Object} opts         Options object
 * @param {Object} opts.config  Configuration object
 * @param {Object} opts.env     Environment object to mutate (Default `process.env`)
 * @returns {void}
 */
var Environment = module.exports = function (opts) {
  opts = opts || {};
  this.config = opts.config;
  this.env = opts.env || process.env;

  // Chalk: Force colors.
  this.env.FORCE_COLOR = "true";

  // Validation
  if (!this.config) {
    throw new Error("Configuration object required");
  }

  // Mutate environment.
  this.env.PATH = this.updatePath(this.config.archetypePaths);
  this.env.NODE_PATH = this.updateNodePath(this.config.archetypeNodePaths);
};

/**
 * Update `PATH` variable with CWD, archetype Node binary paths
 *
 * @param   {Array}   archetypePaths  Archetype `.bin` paths
 * @returns {String}                  `PATH` environment variable
 */
Environment.prototype.updatePath = function (archetypePaths) {
  return (this.env.PATH || "")
    .split(DELIM)
    .filter(function (x) { return x; }) // Remove empty strings
    .concat([CWD_BIN].concat(archetypePaths || []))
    .join(DELIM);
};

/**
 * Update `NODE_PATH` variable with CWD, archetype paths
 *
 * @param   {Array}   archetypeNodePaths  Archetype `node_module` paths
 * @returns {String}                      `NODE_PATH` environment variable
 * @see https://nodejs.org/api/modules.html
 */
Environment.prototype.updateNodePath = function (archetypeNodePaths) {
  return (this.env.NODE_PATH || "")
    .split(DELIM)
    .filter(function (x) { return x; }) // Remove empty strings
    .concat([CWD_NODE_PATH].concat(archetypeNodePaths || []))
    .join(DELIM);
};