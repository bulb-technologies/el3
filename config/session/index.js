(function(){

    var session = require('express-session');
    var sessionStore = require('connect-mongo')(session);
    var db = require(_ + 'config/connection');

    var nativeSessionBT = session({

              name: 'gA2T9ejKVr',
              secret: process.env.SESSION_SECRET,
              resave: false,
              saveUninitialized: false,
              store: new sessionStore({ mongooseConnection: db}),
              cookie: {path: '/native/bt'}

    });

    var nativeSessionCTO = session({

              name: 'cdn3GwvRBF',
              secret: process.env.SESSION_SECRET,
              resave: false,
              saveUninitialized: false,
              store: new sessionStore({ mongooseConnection: db}),
              cookie: {path: '/native/cto'}

    });

    module.exports = {

        nativeSessionBT: nativeSessionBT,
        nativeSessionCTO: nativeSessionCTO

    };

})();
