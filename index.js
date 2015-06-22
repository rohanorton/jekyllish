/*jshint node:true */
'use strict';

require('app-root-dir').set(__dirname);

var path     = require('path');
var postsDir = path.join(__dirname, '_posts');
var watcher  = require('./jekyllish/watcher.js');

watcher(postsDir);
