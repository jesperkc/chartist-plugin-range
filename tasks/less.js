/**
 * Less
 * ======
 *
 * Minify the library.
 *
 * Link: https://github.com/gruntjs/grunt-contrib-less
 */

'use strict';

module.exports = function (grunt) {
  return {
    development: {
        options: {
            paths: ['assets/css']
        },
        files: {
            'dist/style.css': 'src/less/style.less'
        }
    }
  };
};
