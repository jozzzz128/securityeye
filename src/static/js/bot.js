const { Telegraf } = require('telegraf');
const TelegrafQuestion = require('telegraf-question').default;

const db = require('./db.js');

const botCommands = {
    id: '',
    callback: ()=>{},
    init: () => {
        //Launch telegram bot
        bot.launch();
        console.log('Bot started');
    },
    setUserProps: (id, callback) => {
        botCommands.id = id;
        botCommands.callback = callback;
        console.log('User properties defined: ', id);
    },
    getUserProps: () => {
        console.log('User properties retrieved: ');
        return {
            id: botCommands.id,
            callback: botCommands.callback
        };
    }
};

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(TelegrafQuestion({
    cancelTimeout: 10000 // 5 min
}));

//COMANDO START
bot.command('start', (ctx) => {
    console.log('registered users: ', db.registerUser(ctx.chat.id));

    botCommands.setUserProps(ctx.chat.id, async img => {
        try {
            await ctx.replyWithPhoto({source: img});
            bot.telegram.sendMessage(ctx.chat.id, "Se ha detectado movimiento");
        } catch (error) {
            console.log('imagen vacia');
        }
    });

    sendStartMessage(ctx);
})

function getText(ctx, text)
{
    ctx.reply(text);
    bot.on('text', ctx =>{
        return ctx.message.text;
    });
}

//FUNCION MENU INICIO
function sendStartMessage(ctx){
    const startMessage = "Bienvenido al bot de telegram ";

    //Store user info
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {

        reply_markup: {
            inline_keyboard:[ 
            [
                {text: "Registrar", callback_data: 'regist'}
            ],
            [
                {text: "Clientes", callback_data: 'clientes'}
            ],
            [
                {text: "Remover Cliente", callback_data: 'remClient'}
            ]
        ]
        }
    })
}

//HACER REGISTRO
bot.action('regist', ctx => {
    ctx.answerCbQuery();
    ctx.reply("Escribe el codigo del cliente, un espacio y el alias para el cliente");
    
    /*clientAlias = getText(ctx, "Escribe un alias para el cliente");
    clientId = getText(ctx, "Escribe el codigo del cliente");

    if(db.registerClient(ctx.chat.id, clientId, clientAlias)){
        ctx.reply("Se ha registrado el cliente " + clientAlias + " con exito");
    }else{
        ctx.reply("Error al registrar al cliente");
    }*/

    test = ctx.forwardMessage(ctx.chat.id);
    console.log(test);
    
    
   /* bot.on('text', ctx => {
        const message = ctx.message.text.split(' ');
        //console.log(message[0] + " Y " + message[1]);
        if(db.registerClient(ctx.chat.id, message[0], message[1])){
            ctx.reply("Se ha registrado el cliente " + message[1] + " con exito");
        }else{
            ctx.reply("Error al registrar al cliente");
        }
    });*/

});

//CLIENTES
bot.action('clientes', ctx => {
    ctx.answerCbQuery();
    const clients = db.viewClients(ctx.chat.id);
    console.log(clients[0].id);

    text = "Se ha encontrado un total de " + clients.length + " clientes: \n\n";
    
    for(i=0; i<clients.length; i++){
        text = "CLIENTE: " + text + clients[i].alias + ",  ID: " + clients[i].id + "\n";
    }
    ctx.reply(text);
});

//REMOVER CLIENTE
bot.action('remClient', ctx => {
    ctx.answerCbQuery();
    ctx.reply("Ingresa el ID del cliente que deseas remover");

    bot.on('text', ctx => {
        if(db.deleteClient(ctx.chat.id, ctx.message.text)){
            ctx.reply("Se ha eliminado el cliente de manera exitosa");
        }else{
            ctx.reply("Error al eliminar al cliente");
        }
    })
});

module.exports = botCommands;

