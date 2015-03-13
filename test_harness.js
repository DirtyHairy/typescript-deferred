var tsd = require('./tsd');

module.exports = {
    resolved: function(value) {
        return tsd.when(value);
    },

    rejected: function(reason) {
        return tsd.create().reject(reason).promise;
    },

    deferred: function() {
        return tsd.create();
    }
};
