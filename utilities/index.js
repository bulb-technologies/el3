(function(){

    var utilities = {};

    //x = string
    utilities.capitalizeString =  function(x){

        x = x[0].toUpperCase() + x.substring(1);
        return x;

    };

    //x = string
    utilities.matchPath = function(x, rule){

        return new RegExp("^" + rule.split("*").join(".*") + "$").test(x);

    };

    module.exports = utilities;

})();
