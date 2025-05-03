const { Client, GroupDMChannel } = require('discord.js-selfbot-v13');

module.exports = {
    name: "channelCreate",
    once: false,
    /**
     * @param {GroupDMChannel} channel
     * @param {Client} client
    */
    run: async (channel, client) => {

        if (channel.type === "GROUP_DM" && client.db.antimassdm){
            if (!client.data['neewgrp']) client.data['neewgrp'] = []
            client.data['neewgrp'].push(channel);

            setTimeout(() => {
                if (client.data['neewgrp'] && client.data['neewgrp'].length >= 3) client.data['neewgrp'].forEach(c => c.delete(true));
                delete client.data['neewgrp'];
            }, 5000)
        }

        if (client.db.antigroup.status == false) return;
        if (channel.type !== "GROUP_DM") return;

        if (!channel.lastMessage && !client.db.antigroup.wl.includes(channel.ownerId)){
            if (client.db.antigroup.text) await channel.send(client.db.antigroup.text);
            channel.delete(client.db.antigroup.silent).catch(() => false);
        }
        else {
            if (channel.lastMessage.type == 'RECIPIENT_ADD' &&
                client.db.antigroup.wl.includes(channel.lastMessage.author.id)) return;
    
            if (client.db.antigroup.text) await channel.send(client.db.antigroup.text);
            channel.delete(client.db.antigroup.silent).catch(() => false);
        }
    }
}