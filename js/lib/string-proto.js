function fmt(str, formats) {
  // first, replace any ORDERED replacements.
  var idx  = 0; // the current index for non-numerical replacements
  return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
    argIndex = (argIndex) ? parseInt(argIndex, 10) - 1 : idx++;
    s = formats[argIndex];
    return (s === null) ? '(null)' : (s === undefined) ? '' : console.log(s);
  }) ;
}

String.prototype.fmt = fmt;

module.exports = {};
