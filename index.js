const Discord = require("discord.js");
const bot = new Discord.Client();
const fetch = require("node-fetch");
const config = require("./config.json");
var DomParser = require('dom-parser');
var parser = new DomParser();

const prefix = "+";

bot.once("ready", () => {
	console.log("Bot is online!");
});

bot.on("message", async message => {
	if (message.content.startsWith(prefix + 'book', 0)) {
		const args = message.content.slice(5).trim().split(' ');
		const command = args.shift().toLowerCase();

		text = await fetchAuthor(command);
		message.reply(text);
	}
});

bot.on("message", async message => {
	if (message.content.startsWith(prefix + 'author', 0)) {
		const args = message.content.slice(7).trim().split(' ');
		const command = args.shift().toLowerCase();

		text = await fetchBooks(command);
		message.reply(text);
	}
});

async function fetchBooks(string) {
	let response = await fetch('https://www.goodreads.com/search/index.xml?key=iFBuNgOuOt67dGewnaVPg&q=' + string);
	let data = await response.text();

	var xmlDoc = parser.parseFromString(data, "text/xml");
	var x = xmlDoc.getElementsByTagName("results");

	var resultParsed = parser.parseFromString(x[0].innerHTML, "text/xml")
	let authorId = resultParsed.getElementsByTagName("author")[0].childNodes[1].textContent.toString();

	response = await fetch('https://www.goodreads.com/author/list/' + authorId + '?format=xml&key=iFBuNgOuOt67dGewnaVPg');
	data = await response.text();

	xmlDoc = parser.parseFromString(data, "text/xml");
	x = xmlDoc.getElementsByTagName("author");

	console.log(x.length);

	for (i = 0; i < x.length; i++) {
		console.log(x[i].getElementsByTagName("title")[0].childNodes[0].text);
	}


}

async function fetchAuthor(string) {
	let response = await fetch('https://www.goodreads.com/search/index.xml?key=iFBuNgOuOt67dGewnaVPg&q=' + string)
	let data = await response.text();

	var xmlDoc = parser.parseFromString(data, "text/xml");
	var x = xmlDoc.getElementsByTagName("results");

	var resultParsed = parser.parseFromString(x[0].innerHTML, "text/xml")
	return resultParsed.getElementsByTagName("author")[0].childNodes[3].textContent.toString();
}

bot.login(config.token);
