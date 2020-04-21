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