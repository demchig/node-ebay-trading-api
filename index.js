/**
 * Node.js eBay Trading API client
 * https://github.com/demchig/node-ebay-trading-api
 *
 * Copyright (c) 2014 Demchig, Batchuluun
 */

 (function() {

    var Client = require('node-rest-client').Client;
    var xml2js = require('xml2js');
    var fs = require('fs');
    var util = require("util");

    client = new Client();

    // registering remote methods
    client.registerMethod("xmlMethod", "https://api.ebay.com/ws/api.dll", "POST");

    var args = {
        headers : {
            "X-EBAY-API-CALL-NAME" : "GetItem",
            "X-EBAY-API-SITEID" : 0,
            "X-EBAY-API-COMPATIBILITY-LEVEL" : 870,
            "Content-Type" : "text/xml"
        },
        data : ''
    };

    var userToken = '';


    exports.setUserToken = function(token){
        userToken = token;
    };


    exports.getUserToken = function(){
        return userToken;
    };



    exports.call = function(callName, jsonObj, callback){

        args.headers["X-EBAY-API-CALL-NAME"] = callName;
        args.data = buildXmlData(callName, jsonObj);

        client.methods.xmlMethod(args, function(data,response){
            // parsed response body as js object
            //console.log(data);
            // raw response
            //console.log(response);

            xml2js.parseString(data, function(err, result){
                //inspect(result);
                callback(result);
            });
            
        });


    };


    /* ----------------------------------------------------------------
     * functions
     ----------------------------------------------------------------*/
     function buildXmlData(callName, jsonObj)
     {
        var builder = new xml2js.Builder({ headless : true });
        var xmlStr = builder.buildObject(jsonObj);

        var xmlData = '<?xml version="1.0" encoding="utf-8"?>'
        + '<' + callName + 'Request xmlns="urn:ebay:apis:eBLBaseComponents">'
        + '<RequesterCredentials> <eBayAuthToken>'
        + userToken + '</eBayAuthToken> </RequesterCredentials>'
        + xmlStr
        + ' </' + callName + 'Request>';

        return xmlData;
    }

    
    function inspect(value)
    {
        console.log(util.inspect(value, false, null));
    }

}).call(this);