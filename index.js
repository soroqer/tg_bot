const config = require('config')
const telegram = require('telegram-bot-api')
const web3 = require('web3');

const goplus = require("./core/goplus");
const tgEditer = require("./core/tg-editer")

const tgToken = config.get('tg_token');
const api = new telegram({ token: tgToken });
const mp = new telegram.GetUpdateMessageProvider();
api.setMessageProvider(mp);

api.start().then(() => {
    console.log('API is started');
}).catch(console.err)

api.on('update', update => {
    // 处理信息逻辑
    console.log(update.message)
    let text = update.message.text
    if (text) {
        if (text.startsWith("0x") && text.length == 42) {
            if (web3.utils.isAddress(text)) {
                goplus.search(text, function (result) {
                    const reply = tgEditer.editReply(update.message, result)
                    api.sendMessage(reply).catch(error => console.log('caught', error))
                })
            }else{
                const reply = tgEditer.editReply(update.message,{})
                console.log(reply)
                api.sendMessage(reply).catch(error => console.log('caught', error))
            }
        }
    }
})



