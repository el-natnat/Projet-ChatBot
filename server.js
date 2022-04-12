//
// Node.JS Web Server for RiveScript
//


import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
  
/*var express = require("express"),
bodyParser = require("body-parser"),
RiveScript = require("../../lib/rivescript.js");*/
  
import RiveScript from 'rivescript';

const app = express();
app.use(cors()); // Enable ALL CORS request
const port = 3001
  
  
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))

// Create the bot.
var script = new RiveScript();
script.loadDirectory('./brain').then(success_handler).catch(error_handler);
  
function success_handler() {
  console.log('Brain loaded!');
  script.sortReplies();

  // Set up the Express app.
  var app = express();
  
  // Parse application/json inputs.
  app.use(bodyParser.json());
  app.set('json spaces', 4);
  
  // Set up routes.
  app.post('/reply', getReply);
  app.get('/', showUsage);
  app.get('*', showUsage);
  
  // Start listening.
  app.listen(3001, function () {
     console.log('Listening on http://localhost:3001');
  });
}
  
function error_handler(loadcount, err) {
  console.log('Error loading batch #' + loadcount + ': ' + err + '\n');
}
  
// POST to /reply to get a RiveScript reply.
function getReply(req, res) {
  // Get data from the JSON post.
  var username = req.body.username;
  var message = req.body.message;
  var vars = req.body.vars;

  // Make sure username and message are included.
  if (typeof username === 'undefined' || typeof message === 'undefined') {
    return error(res, 'username and message are required keys');
  }
  
  // Copy any user vars from the post into RiveScript.
  if (typeof vars !== 'undefined') {
    for (var key in vars) {
      if (vars.hasOwnProperty(key)) {
        script.setUservar(username, key, vars[key]);
      }
    }
  }

  // Get a reply from the bot.
  script
    .reply(username, message, this)
    .then(function (reply) {
      // Get all the user's vars back out of the script to include in the response.
      vars = script.getUservars(username);

      // Send the JSON response.
      res.json({
        status: 'ok',
        reply: reply,
        vars: vars,
      });
    })
    .catch(function (err) {
      res.json({
        status: 'error',
        error: err,
      });
    });
}
  
// All other routes shows the usage to test the /reply route.
function showUsage(req, res) {
  var egPayload = {
    username: 'soandso',
    message: 'Hello script',
    vars: {
      name: 'Soandso',
    },
  };
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Usage: curl -i \\\n');
  res.write('   -H "Content-Type: application/json" \\\n');
  res.write("   -X POST -d '" + JSON.stringify(egPayload) + "' \\\n");
  res.write('   http://localhost:3001/reply');
  res.end();
}
  
// Send a JSON error to the browser.
function error(res, message) {
  res.json({
    status: 'error',
    message: message,
  });
}
  