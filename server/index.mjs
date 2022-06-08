import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import RiveScript from 'rivescript';


import { Bot } from "./model/Bot.mjs";
import { BotService } from "./model/BotService_LowDb.mjs";

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
/* Partie Discord */
import Discord from 'discord.js';

const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);
console.log('directory-name ', __dirname);

//console.log(path.join(__dirname, '/dist', 'index.html'));


//import Discord from 'discord.js';
/* Empêche les crashs */
process.on('uncaughtException', function (err) {
	console.error(err);
	console.log("Node NOT Exiting...");
  });

const myIntents = new Discord.Intents();
myIntents.add(Discord.Intents.FLAGS.GUILD_MESSAGES);
myIntents.add(Discord.Intents.FLAGS.GUILDS);
const client = new Discord.Client({ intents: myIntents });


client.once('ready', () => {
	console.log("Le bot Discord a été correctement initialisé !");
	client.user.setPresence({
		activities: [{
			name: "Je chatte avec toi ;)"
		}],
		status: "dnd"
	});
});

client.on("messageCreate", message => {
	console.log("Message reçu");


	let entry = message.content;
	/*if (message.content === "!ping") {
		message.channel.send("Pong.")
		
	}*/
	
	if (message.author.bot == false) { //Si message n'est pas un message d'un bot


		console.log(message);

		bot.sortReplies();
		// Get a reply from the bot.

		bot.setVariable("master", message.author.username);
		bot.setVariable("name", "botname");
		/*bot.reply(username, "Hello, bot!").then(function(reply) {
			console.log("The bot says: " + reply);
		  });
		  */
		bot
			.reply(username, message.content, this)

			.then(function (reply) {
				console.log("Works");

				var output = reply;
				if (output != "ERR: No Reply Matched") {
					message.channel.send(output)
				}
				else {
					message.channel.send("Oups")
				}
			});
	}

})


var BotServiceInstance;

//import {PersonIdentifier,PersonService} from "./model/Persons.mjs";
//let personServiceAccessPoint = new PersonService({url:"http://localhost",port:3001});
//Question : How do I assigne a task to a person? : It is a PATCH to a Task...


const app = express();


//// Enable ALL CORS request
app.use(cors())
////

const port = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
var bot = new RiveScript();

app.post('/load', load_brain_bot);

/**
 * @description charge le cerveau du bot
 * @param {*} cerveau cerveau du bot
 * @param {*} name nom du bot
 */
function load_brain_bot(req, res) {
	bot = new RiveScript();
	let cerveau = BotServiceInstance.getBot(req.body.botId).cerveau;
	// Create the bot.
	console.log(cerveau);
	//bot.loadFile('./server/brain/cerveau1.rive').then(success_handler).catch(error_handler);
	bot.loadFile('./brain/' + cerveau + '.rive').then(success_handler()).catch(error_handler);

	res.status(201).send('All is OK');
}

/**
 *
 * @description permet de mettre à jour un bot
 * @param {*} req //requête reçue
 * @param {*} res //réponse envoyée
 * @return {*} 
 */
app.put('/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { 
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		console.log("put en cours");
		console.log(newValues);

		BotServiceInstance
			.replaceBot(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});

/**
 * @description fonction permettant de paramétrer le bot à partir du cerveau et préparer les routes
 */
function success_handler() {
	console.log('Brain loaded!');


	bot.sortReplies();

	/*// Set up the Express app.
	var app = express();*/

	// Parse application/json inputs.
	app.use(bodyParser.json());
	app.set('json spaces', 4);

	// Set up routes.
	app.post('/reply', getReply);
}

function error_handler(loadcount, err) {
	console.log('Error loading batch #' + loadcount + ': ' + err + '\n');
}



// POST to /reply to get a RiveScript reply.
/**
 *
 * @description permet au bot de renvoyer une réponse
 * @param {*} req //requête reçue
 * @param {*} res //réponse envoyée
 * @return {*} 
 */
function getReply(req, res) {

	console.log("Entree reply");
	// Get data from the JSON post.
	var username = req.body.username;
	var message = req.body.message;
	var vars = req.body.vars;
	var botname = req.body.botname;

	// Make sure username and message are included.
	if (typeof username === 'undefined' || typeof message === 'undefined') {
		console.log("Erreur username / message");
		return error(res, 'username and message are required keys');
	}

	// Copy any user vars from the post into RiveScript.
	if (typeof vars !== 'undefined') {
		console.log("recup vars");
		for (var key in vars) {
			if (vars.hasOwnProperty(key)) {
				bot.setUservar(username, key, vars[key]);
			}
		}
	}

	bot.sortReplies();
	// Get a reply from the bot.

	bot.setVariable("name", botname);
	
	bot
		.reply(username, message, this)
		.then(function (reply) {
			// Get all the user's vars back out of the script to include in the response.
			vars = bot.getUservars(username);

			// Send the JSON response.
			console.log("normalement c'est bon");
			res.json({
				"status": "ok",
				"reply": reply,
				"vars": vars
			});
		})
		.catch(function (err) {
			console.log("merde");
			res.json({
				status: 'error ' + err.stack,
				error: err,
			});
		});
}


/**
 *
 * @description permet de récupérer la liste des bots
 * @param {*} req //requête reçue
 * @param {*} res //réponse envoyée
 * @return {*} 
 */
app.get('/', (req, res) => {
	try {
		let myArrayOfBots;
		if (undefined == (myArrayOfBots = BotServiceInstance.getBots())) {
			throw new Error("No bots to get");
		}
		res.status(200).json(myArrayOfBots);
	}
	catch (err) {
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});

/**
 *
 * @description fonction d'authentification
 * @param {*} req //requête reçue
 * @param {*} res //réponse envoyée
 * @return {*} 
 */
app.post('/login', (req, res) => {
	// Insert Login Code Here
	console.log(req.body);
	let username = req.body.name;
	let pwd = req.body.password;
	console.log("verif login " +username + " " +"& "+ pwd );
	if (username == 'admin' && pwd == 'password') {
   
	  // If Authorized user
	  res.json({
		status: "ok"
	  });
	} else {
	  var err = new Error('You are not authenticated!');
	  err.status = 401;
	  res.json({
		status: 'error ' + err.stack,
		error: err,
	});
	console.log(res.body);
  }
  
  });


//End point to get a bot
/**
 *
 * @description permet de récupérer un bot
 * @param {*} req //requête reçue
 * @param {*} res //réponse envoyée
 * @return {*} 
 */
app.get('/:idd', (req, res) => {
	let id = req.params.idd;
	if (!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	} else {
		try {
			let myBot = BotServiceInstance.getBot(id);
			res.status(200).json(myBot);
		}
		catch (err) {
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(404).send('NOT FOUND');
		}
	}
});

/**
 *
 * @description permet de supprimer un bot
 * @param {*} req //requête reçue
 * @param {*} res //réponse envoyée
 * @return {*} 
 */
app.delete('/:id', (req, res) => {
	console.log(req.body);
	let id = req.params.id;
	console.log(id);
	if (!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST bad id');
	} else {
		BotServiceInstance
			.removeBot(id)
			.then((returnString) => {
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err) => {
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST ERROR');
			});
	}
});


/**
 *
 * @description permet d'ajouter un bot
 * @param {*} req //requête reçue
 * @param {*} res //réponse envoyée
 * @return {*} 
 */
app.post('/', (req, res) => {
	

	let theBotToAdd = req.body;

	console.log(theBotToAdd);

	console.log(theBotToAdd.token);


	if (theBotToAdd.discord == true) {
		try {
			client.login(theBotToAdd.token);
		} catch (error) {
			console.error(error);
		}
	}

	/*res.status(201).send('All is OK');*/
	BotServiceInstance
		.addBot(theBotToAdd)
		.then((returnString) => {
			console.log(returnString);
			res.status(201).send(theBotToAdd);
		})
		.catch((err) => {
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(400).send('BAD REQUEST');
		});
});


/**
 * Création du service de bot
 */
BotService.create().then(ts => {
	BotServiceInstance = ts;

	app.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`)
	});
});


function isInt(value) {
	let x = parseFloat(value);
	return !isNaN(value) && (x | 0) === x;
}


