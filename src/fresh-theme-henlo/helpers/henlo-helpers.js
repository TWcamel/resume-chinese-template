(function() {
  var HenloHelpers = module.exports = {
    concat: function() {
      arguments = [...arguments].slice(0, -1);

      return arguments.join('');
    },
  };

}).call(this);
