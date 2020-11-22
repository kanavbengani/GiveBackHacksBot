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
	if (message.content.startsWith(prefix + 'author')) {
		const args = message.content.slice(7).trim().split(' ');
		const bookName = args.shift().toLowerCase();

		text = await fetchAuthor(bookName);
		message.reply(text);
	}
});

bot.on("message", async message => {
	if (message.content.startsWith(prefix + 'books', 0)) {
		const args = message.content.slice(6).trim().split(' ');
		const authorName = args.shift().toLowerCase();

		let array = await fetchBooks(authorName);
		message.reply("\n1: " + array[0] + "\n" +
			"2: " + array[1] + "\n" +
			"3: " + array[2] + "\n" +
			"4: " + array[3] + "\n" +
			"5: " + array[4] + "\n");
	}
});

async function fetchBooks(string) {
	let response = await fetch('https://www.goodreads.com/api/author_url/' + string + '?key=iFBuNgOuOt67dGewnaVPg');
	let data = await response.text();

	var xmlDoc = parser.parseFromString(data, "text/xml");
	let authorId = xmlDoc.getElementsByTagName("author")[0].getAttribute("id").toString();
	console.log("Author Id: " + authorId);

	// var x = xmlDoc.getElementsByTagName("results");
	// var resultParsed = parser.parseFromString(x[0].innerHTML, "text/xml")
	// let authorId = resultParsed.getElementsByTagName("author")[0].childNodes[1].textContent.toString();

	response = await fetch('https://www.goodreads.com/author/list/' + authorId + '?format=xml&key=iFBuNgOuOt67dGewnaVPg');
	data = await response.text();

	xmlDoc = parser.parseFromString(data, "text/xml");
	x = xmlDoc.getElementsByTagName("author");

	let arr = [];
	for (i = 0; i < 5; i++) {
		arr[i] = x[0].childNodes[8].getElementsByTagName("title")[i].textContent;
	}

	return arr;
}

async function fetchAuthor(authorName) {
	let response = await fetch('https://www.goodreads.com/search/index.xml?key=iFBuNgOuOt67dGewnaVPg&q=' + authorName)
	let data = await response.text();

	var xmlDoc = parser.parseFromString(data, "text/xml");
	var x = xmlDoc.getElementsByTagName("results");

	var resultParsed = parser.parseFromString(x[0].innerHTML, "text/xml")
	return resultParsed.getElementsByTagName("author")[0].childNodes[3].textContent.toString();
}

bot.login(config.token);
