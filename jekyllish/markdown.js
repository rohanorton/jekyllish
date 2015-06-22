/*jshint node:true */
'use strict';

var marked     = require('marked');
var pygmentize = require('pygmentize-bundled');

marked.setOptions({
    renderer    : new marked.Renderer(),
    gfm         : true,
    tables      : true,
    sanitize    : true,
    smartLists  : true,
    smartypants : true,
    breaks      : false,
    pedantic    : false,
    highlight   : function (code, lang, callback) {
        pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
            return callback(err, result.toString());
        });
    },
});

module.exports = marked;
