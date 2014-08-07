
global.$ = $;
global.console = console;

var gui   = require('nw.gui');
var win   = gui.Window.get();
var path  = require("path");

require('lib/string-proto');
var tmb   = require("lib/time-machine-smb");

//
// Setup DB
// -------------------------------------------------------------------
var store = require("jfs");
var home = process.env['HOME'];
var dbPath = path.join(home, '.tms-util.json');
var db = new store(dbPath);
var appData = db.getSync('data') || {};

//
// Setup GUI
// -------------------------------------------------------------------
var gui = require('nw.gui');
var mb = new gui.Menu({type:"menubar"});
mb.createMacBuiltin("Time Machine SMB Util");
gui.Window.get().menu = mb;

//
// Ember App
// -------------------------------------------------------------------

App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
  }
});

//
// IndexView
// -------------------------------------------------------------------
App.IndexView = Ember.View.extend({
  actions: {
    run: function() {
      this.set('buttonText', "Time Machine should be backing up, please verify.");
      tmb.create({
        smbLocation: this.get('smbLocation'),
        smbMountName: this.get('smbMountName'),
        sparseimageAttachName: this.get('sparseimageAttachName'),
        sparseimagePath: this.get('sparseimagePath')
      });

      Ember.run.later(this, function(){
        this.set('buttonText', "Run");
      }, 3000);
    }
  },

  smbLocation: appData.smbLocation,
  smbMountName: appData.smbMountName,
  sparseimagePath: appData.sparseimagePath,
  sparseimageAttachName: appData.sparseimageAttachName,

  data: function() {
    return {
      smbLocation: this.get('smbLocation'),
      smbMountName: this.get('smbMountName'),
      sparseimagePath: this.get('sparseimagePath'),
      sparseimageAttachName: this.get('sparseimageAttachName'),
    };
  }.property('smbLocation', 'smbMountName', 'sparseimagePath', 'sparseimageAttachName'),

  syncWithStore: function() {
    db.save( "data", this.get('data') );
  }.observes('smbLocation', 'smbMountName', 'sparseimagePath', 'sparseimageAttachName'),

  buttonText: 'Run'

});
