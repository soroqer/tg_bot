const config = require('config')

exports.editReply = function (message, result) {
    const text = editText(result);
    const markup = editMarkup(result);

    const msg = {
        parse_mode:"MarkdownV2",
        reply_to_message_id:message.message_id,
        chat_id: message.chat.id,
        disable_web_page_preview:'true',
        text: text,
        reply_markup:markup
    }
    return msg;
}

function editText (result){
    let text = "";
    for (let key in result) {
        let info = result[key];
        text = "\n*合约*\n";
        text += "\n Token名称：`" + info.token_symbol + "(" + info.token_name + ")`";
        if (info.total_supply == undefined) {
            text += "\n 发行总量：`\\--`";
        }else{
            text += "\n 发行总量：`" + info.total_supply.toString().match(/^\d+(?:\.\d{0,5})?/) + "`";
        }
        text += "\n 买入费率：`" + (info.buy_tax * 100).toString().match(/^\d+(?:\.\d{0,2})?/) + "%`";
        text += "\n 卖出费率：`" + (info.sell_tax * 100).toString().match(/^\d+(?:\.\d{0,2})?/) + "%`";
        text += "\n 是否开源：`" + (info.is_open_source == '0' ? "否 🔴`" : "是 🟢`");
        text += "\n 能否全卖：`" + (info.cannot_sell_all == '0' ? "能 🟢`" : "否 🔴`");
        text += "\n 能否增发：`" + (info.is_mintable == '0' ? "否 🟢`" : "能 🔴`");
        text += "\n 暂停交易：`" + (info.transfer_pausable == '0' ? "否 🟢`" : "能 🔴`");
        text += "\n 代理合约：`" + (info.is_proxy == '0' ? "无 🟢`" : "有 🔴`");
        if (info.owner_address == "" || info.owner_address == "0x0000000000000000000000000000000000000000") {
            text += "\n 权限地址：`无 🟢`"
            text += "\n 取回权限：`" + (info.can_take_back_ownership == '0' ? "否 🟢`" : "能 🔴`");
        }else{
            text += "\n 权限地址：" + "[0x" + info.owner_address.substring(2,7).toUpperCase() + "\\.\\.\\." + info.owner_address.substring(36).toUpperCase() + "](https://bscscan.com/address/" + info.owner_address + ")  🔴";
        }



        text += "\n\n*持仓* `" + info.holder_count + "`\n\n";
        for (let index in info.holders) {
            const holder = info.holders[index];
            let percent = (holder.percent * 100).toString().match(/^\d+(?:\.\d{0,2})?/) + "%";
            text += " [0x" + holder.address.substring(2,7).toUpperCase() + "\\.\\.\\." + holder.address.substring(36).toUpperCase() + "](https://bscscan.com/address/" + holder.address + ")：`" + percent + (holder.is_contract == 1 ? "(合约)`\n" : "`\n");
            if (index >= 5) break;
        }

        text += "\n*LP持仓* `" + info.lp_holder_count + "`\n\n";
        for (let index in info.lp_holders) {
            const holder = info.lp_holders[index];
            let percent = (holder.percent * 100).toString().match(/^\d+(?:\.\d{0,2})?/) + "%";
            text += " [0x" + holder.address.substring(2,7).toUpperCase() + "\\.\\.\\." + holder.address.substring(36).toUpperCase() + "](https://bscscan.com/address/" + holder.address + ")：`" + percent + (holder.is_contract == 1 ? "(合约)`\n" : "`\n");
            if (index >= 5) break;
        }
    }
    if (text == "") {
        text = "未查询到 Token 信息，可能这并不是一个 BEP\\-20 合约地址。"
    }
    return text;
}
function editMarkup (result) {

    let kLineUrl = config.get('webUrl');
    let kLineText = "K线"
    for (let key in result) {
        const info = result[key]
        kLineText = info.token_symbol + "--K线";
        for (let index in result[key].dex) {
            const pair = result[key].dex[index].pair;
            kLineUrl += "/#/quote?pair=" + pair;
            break
        }
    }

    const markup = {
        inline_keyboard:[
            [
                {
                    text:kLineText,
                    url:kLineUrl
                },
                {
                    text:"加入 defidoor 官方群",
                    url:config.get('tgUrl')
                }
            ]
        ]
    };
    return markup;
}