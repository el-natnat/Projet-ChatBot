/**
 Partie Discord 
 */

import Discord from 'discord.js';
const myIntents = new Discord.Intents();
myIntents.add(Discord.Intents.FLAGS.GUILD_MESSAGES);
myIntents.add(Discord.Intents.FLAGS.GUILDS);
const client = new Discord.Client({ intents: myIntents });
const token = "OTgyNzIyNDkwMDgwMDU5Mzky.GLqIuy.Zubx5mQZ2k-V0ydUOohkbXju3yPf-T1cl7r7PE";
client.login(token);

client.once('ready', () => {
	console.log("Le bot Discord a été correctement initialisé !");
	client.user.setPresence({
		activities: [{
			name:"Je chatte avec toi ;)"
		}],
		status: "dnd"
	});
});

client.on("messageCreate", async message => {
	console.log("Message reçu");
	if (message.content === "!ping") {
		message.channel.send("Pong.")
	}
})


/**
 Fin partie Discord* 
 */