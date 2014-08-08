
// mkdir "/Volumes/Brian"
// mount_smbfs "//192.168.1.1/brian" "/Volumes/Brian"
// mkdir "/Volumes/Time\ Machine\ Backup/"
// hdiutil attach -quiet -mountpoint "/Volumes/Time\ Machine\ Backup/" "/Volumes/Brian/Backups/Time-Machine.sparseimage"
// sudo tmutil setdestination "/Volumes/Time\ Machine\ Backup/"
// sudo tmutil startbackup

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

function TimeMachineSMB (){ }

TimeMachineSMB.prototype.setup = function(opts) {
  opts = opts || {};

  this.opts = opts;

  this.mount();
  this.attach();
  this.setDestination();
};

TimeMachineSMB.prototype.mount = function() {
  var mountpoint = path.join("/Volumes/", this.opts.smbMountName);
  if (!fs.existsSync(mountpoint))
    fs.mkdirSync(mountpoint);

  var mountCMD = "mount_smbfs \"%@\" \"%@\"".fmt(
    this.opts.smbLocation,
    mountpoint
    );

  exec(mountCMD, function (error, stdout, stderr) {
    console.log('[ERROR] Unable to mount.', arguments);
  });
};

TimeMachineSMB.prototype.attach = function() {
  var attachpoint = path.join("/Volumes/", this.opts.sparseimageAttachName);

  if (!fs.existsSync(attachpoint))
    fs.mkdirSync(attachpoint);

  var attachCMD = 'hdiutil attach -quiet -mountpoint "%@" "%@"'.fmt(
    attachpoint,
    path.join("/Volumes/", this.opts.smbMountName, this.opts.sparseimagePath)
    );

  exec(attachCMD, function (error, stdout, stderr) {
    console.log('[ERROR] Unable to attach.', arguments);
  });
};

TimeMachineSMB.prototype.setDestination = function() {
  var setdestCMD = 'sudo tmutil setdestination "%@"'.fmt(
    path.join("/Volumes/", this.opts.sparseimageAttachName)
    );
  exec(setdestCMD);
  exec("tmutil startbackup");
};

TimeMachineSMB.prototype.create = function(opts) {
  return new TimeMachineSMB().setup(opts);
};

module.exports = new TimeMachineSMB();
