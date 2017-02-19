var request = require('request');
var AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2"
});

'use strict';

module.exports.fetch = (event, context, callback) => {
  
  fetchWaitingtimes(callback);
};

module.exports.queryWaitTime = (event, context, callback) => {
  
  queryall(callback);
};



var docClient = new AWS.DynamoDB.DocumentClient();
var table = "broncoshuttle_waiting_time";


  function fetchWaitingtimes(callback) {
    
    request('https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info', function (error, response, body) {
      
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);

        const responseOk = {

          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify(result),
        };
        callback(null, responseOk); 

        //for(var i = 0; i < result.length; i++) {
          //console.log(result[i]);
        //  putItem(result[i].id, result[i].logo, result[i].lat, result[i].lng, result[i].route, callback);
          
       // }
      }
      
    });
  }

function putItem(id, logo, lat, lng, route, callback) {
  var params = {
      TableName:table,
      Item:{
          "id": id,
          "logo" : logo,
          "lat" : lat,
          "lng" : lng,
          "route" : route,
          "timestamp": Date.now(),
      }
  };

 // console.log("Adding a new item...");
  docClient.put(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        const responseErr = {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify({
            message: 'Failed!'
          }),
        };
        callback(null, responseErr);
      } else {

        const responseOk = {

          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify([params.Item]),
        };
        callback(null, responseOk); 
      }
  });       
}

function queryall(callback) {

    request('https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info', function (error, response, body) {
      
      if (!error && response.statusCode == 200) {
        // console.log(body);
        var result = JSON.parse(body);

        


        const responseOk = {

          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify(result),
        };
        callback(null, responseOk); 
      }
      
    });
}

function queryWaitingtimes(id, callback) {
  var params = {
    TableName : table,
    KeyConditionExpression: "#key = :identification",
    ExpressionAttributeNames:{
      "#key": "id"
    },
    ExpressionAttributeValues: {
      ":identification":id
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));      
      if (callback) {
        const responseErr = {
          statusCode: 500,
          body: JSON.stringify({'err' : err}),
        };
        callback(null, responseErr);  
      }
    } else {

      
      if (callback) {
        const responseOk = {
          statusCode: 200,
          body: JSON.stringify(data),
        };
        callback(null, responseOk);  
      }
    }
  });
}
