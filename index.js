const Discord = require("discord.js");

const bot = new Discord.Client();
const config = require("./config.json");

bot.once("ready", () => {
	console.log("Bot is online!");
});

bot.on("message", (msg) => {
	if (msg.content === "Hello") {
		msg.reply("Sup!");
	}
});

bot.login(config.token);
