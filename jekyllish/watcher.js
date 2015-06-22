/*jshint node:true */
'use strict';

var log        = require('./logger.js');
var Post       = require('./post.js');
var chokidar   = require('chokidar');

var files = {};

function createPost(filepath) {
    files[filepath] = new Post(filepath, function (err) {
        if (err) {
            log(filepath, 'not added', err);
            return delete files[filepath];
        }
        log(filepath, 'added');
    });
}

function removePost(filepath) {
    if (files[filepath]) {
        files[filepath].destroy();
        delete files[filepath];
    }
}

module.exports = function (dir) {
    chokidar.watch(dir, { persistant: true })
            .on('add', createPost)
            .on('change',createPost)
            .on('unlink', removePost);
};
