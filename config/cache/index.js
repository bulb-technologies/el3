(function(){

    var fs =  require('fs');
    var https =  require('https');
    var NodeCache = require('node-cache');
    var appCache = new NodeCache();

    //get latest version
    https.get('https://storage.googleapis.com/ucbrtkx7ucef7zh/env/drts-permits-and-vehicle-licence-fees-production.json', function(res){

        if(res.statusCode !== 200){

            throw new Error('Request failed: \n' + 'StatusCode: ' + res.statusCode);

        }else{

            var rawData = '';

            res.on('data', function(chunk){

                rawData += chunk;

            })
            .on('end', function(){

                var jsonPayload;

                //attempt to parse raw data as json
                try{

                    jsonPayload = JSON.parse(rawData);

                }catch(e){

                    throw e;

                }

                //init some key/value pairs
                appCache.set('feeReferences', jsonPayload, function(err, success){

                    if(!success){

                        throw new Error('Failed to cache feeReferences at app start up.');
                        
                    }

                });

            })
            .on('error', function(e){

                throw e;

            });

        }

    });

    module.exports = appCache;

})();
