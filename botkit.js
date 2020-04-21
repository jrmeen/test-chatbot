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
  verify_token: process.env.FB_VERIFY_TOKEN,
  access_token: process.env.FB_ACCESS_TOKEN
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

let { Botkit } = require('botkit');

const controller = new Botkit(MY_CONFIGURATION);

controller.hears('hello','direct_message', function(bot, message) {
    bot.reply(message,'Hello yourself!');
});


const { Botkit } = require('botkit');

const controller = new Botkit({
    webhook_uri: '/api/messages',
});

controller.hears('.*','message', async(bot, message) => {

    await bot.reply(message, 'I heard: ' + message.text);

});

controller.on('event', async(bot, message) => {
    await bot.reply(message,'I received an event of type ' + message.type);
});

const { FacebookAdapter } = require('botbuilder-adapter-facebook');