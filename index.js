// 'use strict';
// const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// // Imports dependencies and set up http server
// const 
//   request = require('request'),
//   express = require('express'),
//   body_parser = require('body-parser'),
//   app = express().use(body_parser.json()); // creates express http server

// // Sets server port and logs message on success
// app.set( 'port', ( process.env.PORT || 3000 ));

// // Start node server
// app.listen( app.get( 'port' ), function() {
//   console.log( 'Node server is running on port ' + app.get( 'port' ));
//   });
// // Accepts POST requests at /webhook endpoint
// app.post('/webhook', (req, res) => {  

//   // Parse the request body from the POST
//   let body = req.body;

//   // Check the webhook event is from a Page subscription
//   if (body.object === 'page') {

//     body.entry.forEach(function(entry) {

//       // Gets the body of the webhook event
//       let webhook_event = entry.messaging[0];
//       console.log(webhook_event);


//       // Get the sender PSID
//       let sender_psid = webhook_event.sender.id;
//       console.log('Sender ID: ' + sender_psid);

//       // Check if the event is a message or postback and
//       // pass the event to the appropriate handler function
//       if (webhook_event.message) {
//         handleMessage(sender_psid, webhook_event.message);        
//       } else if (webhook_event.postback) {
        
//         handlePostback(sender_psid, webhook_event.postback);
//       }
      
//     });
//     // Return a '200 OK' response to all events
//     res.status(200).send('EVENT_RECEIVED');

//   } else {
//     // Return a '404 Not Found' if event is not from a page subscription
//     res.sendStatus(404);
//   }

// });

// app.use(express.static("build"));

// // Accepts GET requests at the /webhook endpoint
// app.get('/webhook', (req, res) => {

//   // Your verify token. Should be a random string.
//   let VERIFY_TOKEN ="Facebook"
    
//   // Parse the query params
//   let mode = req.query['hub.mode'];
//   let token = req.query['hub.verify_token'];
//   let challenge = req.query['hub.challenge'];
    
//   // Checks if a token and mode is in the query string of the request
//   if (mode && token) {
  
//     // Checks the mode and token sent is correct
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
//       // Responds with the challenge token from the request
//       console.log('WEBHOOK_VERIFIED');
//       res.status(200).send(challenge);
    
//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);      
//     }
//   }
// });



// function handleMessage(sender_psid, received_message) {
//   let response;
  
//   // Checks if the message contains text
//   if (received_message.text) {    
//     // Create the payload for a basic text message, which
//     // will be added to the body of our request to the Send API
//     response = {
//       "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
//     }
//   } else if (received_message.attachments) {
//     // Get the URL of the message attachment
//     let attachment_url = received_message.attachments[0].payload.url;
//     response = {
//       "attachment": {
//         "type": "template",
//         "payload": {
//           "template_type": "generic",
//           "elements": [{
//             "title": "Is this the right picture?",
//             "subtitle": "Tap a button to answer.",
//             "image_url": attachment_url,
//             "buttons": [
//               {
//                 "type": "postback",
//                 "title": "Yes!",
//                 "payload": "yes",
//               },
//               {
//                 "type": "postback",
//                 "title": "No!",
//                 "payload": "no",
//               }
//             ],
//           }]
//         }
//       }
//     }
//   } 
  
//   // Send the response message
//   callSendAPI(sender_psid, response);    
// }

// function handlePostback(sender_psid, received_postback) {
//   console.log('ok')
//    let response;
//   // Get the payload for the postback
//   let payload = received_postback.payload;

//   // Set the response based on the postback payload
//   if (payload === 'yes') {
//     response = { "text": "Thanks!" }
//   } else if (payload === 'no') {
//     response = { "text": "Oops, try sending another image." }
//   }
//   // Send the message to acknowledge the postback
//   callSendAPI(sender_psid, response);
// }

// function callSendAPI(sender_psid, response) {
//   // Construct the message body
//   let request_body = {
//     "recipient": {
//       "id": sender_psid
//     },
//     "message": response
//   }

//   // Send the HTTP request to the Messenger Platform
//   request({
//     "uri": "https://graph.facebook.com/v2.6/me/messages",
//     "qs": { "access_token": PAGE_ACCESS_TOKEN },
//     "method": "POST",
//     "json": request_body
//   }, (err, res, body) => {
//     if (!err) {
//       console.log('message sent!')
//     } else {
//       console.error("Unable to send message:" + err);
//     }
//   }); 
// }


'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var router = express.Router();
var http = require('http').Server(app);


require('dotenv').config()

// You need it to get the body attribute in the request object.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))


var botkit = require('botkit');

var facebookController = botkit.facebookbot({
  verify_token: process.env.VERIFY_TOKEN,
  access_token: process.env.PAGE_ACCESS_TOKEN
});

var facebookBot = facebookController.spawn({});

facebookController.setupWebserver("5000",function(err,webserver) {
  facebookController.createWebhookEndpoints(facebookController.webserver, facebookBot, function() {
      console.log('Your facebook bot is connected.');
  });
});

facebookController.hears(['.*'], 'message_received', function(bot, message){
  facebookBot.reply(message, 'You wrote -  '+message.text);
});