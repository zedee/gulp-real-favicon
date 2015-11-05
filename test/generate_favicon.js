'use strict';

var gulp = require('gulp');
var realFavicon = require('../');
var assert = require('assert');
var path = require('path');
var fs = require("fs");
var rimraf = require('rimraf');

describe('generateFavicon', function() {
  this.timeout(5000);

  beforeEach(function() {
    if (! fs.existsSync(path.join(__dirname, 'output'))) {
      fs.mkdirSync(path.join(__dirname, 'output'));
    }
  });

  afterEach(function() {
    rimraf.sync(path.join(__dirname, 'output'));
  });

  it('should invoke the API without settings and versioning', function(done) {
    realFavicon.generateFavicon({
      masterPicture: path.join(__dirname, 'fixtures', 'sample_picture_1.png'),
      iconsPath: '/some/path',
      design: {
        desktopBrowser: {}
      },
      markupFile: path.join(__dirname, 'output', 'markups.html'),
      dest: path.join(__dirname, 'output')
    }, function(err) {
      assert.equal(err, undefined);

      // Make sure desktop icons were generated, but not iOS icons
      assert(fs.statSync(path.join(__dirname, 'output', 'favicon.ico')).isFile());
      assert(! fs.existsSync(path.join(__dirname, 'output', 'apple-touch-icon.png')));

      // Make sure some code is store in the markup file
      var mf = path.join(__dirname, 'output', 'markups.html');
      assert(fs.existsSync(mf));
      var markups = fs.readFileSync(mf);
      assert(markups);
      assert(markups.length > 230);
      assert(markups.length < 400);

      done();
    });
  });

  it('should invoke the API settings and versioning', function(done) {
    realFavicon.generateFavicon({
      masterPicture: path.join(__dirname, 'fixtures', 'sample_picture_1.png'),
      iconsPath: '/some/path',
      design: {
        androidChrome: {
          pictureAspect: 'shadow',
          manifest: {
            appName: 'My app'
          }
        }
      },
      settings: {
        compression: 2
      },
      versioning: {
        paramName: 'The_Param'
      },
      markupFile: path.join(__dirname, 'output', 'markups.html'),
      dest: path.join(__dirname, 'output')
    }, function(err) {
      assert.equal(err, undefined);

      // Make sure desktop icons were generated, but not iOS icons
      assert(fs.statSync(path.join(__dirname, 'output', 'android-chrome-96x96.png')).isFile());
      assert(! fs.existsSync(path.join(__dirname, 'output', 'favicon.ico')));

      // Make sure some code is store in the markup file
      var mf = path.join(__dirname, 'output', 'markups.html');
      assert(fs.existsSync(mf));
      var markups = fs.readFileSync(mf);
      assert(markups);
      assert(markups.length > 230);
      assert(markups.length < 400);

      done();
    });
  });
});
