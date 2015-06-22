/*jshint node:true */
'use strict';

var path       = require('path');
var fs         = require('fs');
var yaml       = require('js-yaml');
var markdown   = require('./markdown.js');

var rootDir    = require('app-root-dir').get();

function getFullPath(relpath) {
   return path.join(rootDir, relpath);
}

var postsDir = getFullPath('_posts');
var siteDir  = getFullPath('_site');


function Post(filepath, done) {
    if (!filepath || typeof filepath !== 'string') {
        return done(new Error('Post requires a filepath.'));
    }
    this.srcPath    = filepath;
    this.srcExt     = path.extname(filepath);
    this.basename   = path.basename(filepath, this.srcExt);
    this.destPath   = path.join(siteDir, this.basename + '.html');
    this.isMarkdown = this.srcExt === '.md' || this.srcExt === '.markdown';
    this.isHtml     = this.srcExt === '.html';
    this.isHidden   = /^[\._]/.test(this.basename);
    this.metadata   = {};
    this.html       = null;
    this.done       = done;

    if (this.isHidden) {
        return done(new Error('Hidden file'));
    }

    this.create();
}

Post.prototype.writeFile = function () {
    var that = this;
    fs.writeFile(this.destPath, this.html, function (err) {
        return that.done(err);
    });
};

Post.prototype.setHtmlContent = function (callback) {
    var that = this;
    if (this.isHtml) {
        this.html = this.metadata.content;
        callback();
    } else if (this.isMarkdown) {
        markdown(this.metadata.content, function (err, html) {
            that.html = html;
            return callback();
        });
    } else {
        callback(new Error('Unhandled filetype: ' + this.srcExt));
    }
};

Post.prototype.create = function () {
    var that = this;
    fs.readFile(this.srcPath, 'utf8', function (err, filecontent) {
        if (err) {
            return that.done(err);
        }
        that.setMetadata(filecontent);
        that.setHtmlContent(function (err) {
            if (err) {
                return that.done(err);
            }
            that.writeFile();
        });
    });
};

Post.prototype.setMetadata = function (content) {
    var end;
    if (/^---\n/.test(content)) {
        end = content.search(/\n---\n/);
        if (end !== -1) {
            this.metadata = yaml.load(content.slice(4, end + 1));
            content  = content.slice(end + 5);
        }
    }
    this.metadata.content = content;
};

Post.prototype.destroy = function () {
    fs.unlink(this.destPath);
};

module.exports = Post;
