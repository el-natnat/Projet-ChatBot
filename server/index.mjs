import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import RiveScript from 'rivescript';


import {Bot} from "./model/bot.mjs";
/*import {TaskService} from "./model/TaskService_ArrayImpl.mjs";
let taskServiceInstance;
*/

import {PersonIdentifier,PersonService} from "./model/Persons.mjs";
let personServiceAccessPoint = new PersonService({url:"http://localhost",port:3001});
//Question : How do I assigne a task to a person? : It is a PATCH to a Task...


const app = express();


//// Enable ALL CORS request
app.use(cors())
////

const port = 3001

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 


function creer_bot() {
	// Create the bot.
	var script = new RiveScript();
	script.loadDirectory('./brain').then(success_handler(script)).catch(error_handler);
}

function success_handler(script) {
  console.log('Brain loaded!');
  script.sortReplies();

  /*// Set up the Express app.
  var app = express();*/
  
  // Parse application/json inputs.
  app.use(bodyParser.json());
  app.set('json spaces', 4);
  
  // Set up routes.
  app.post('/reply', getReply);
  //app.get('*', showUsage);
  
  /*// Start listening.
  app.listen(3001, function () {
     console.log('Listening on http://localhost:3001');
  });*/
}
  
function error_handler(loadcount, err) {
  console.log('Error loading batch #' + loadcount + ': ' + err + '\n');
}

// POST to /reply to get a RiveScript reply.
function getReply(req, res) {
	// Get data from the JSON post.
	var username = req.body.username;
	var message = req.body.message;
	var vars = req.body.vars;
  
	// Make sure username and message are included.
	if (typeof username === 'undefined' || typeof message === 'undefined') {
	  return error(res, 'username and message are required keys');
	}
	
	// Copy any user vars from the post into RiveScript.
	if (typeof vars !== 'undefined') {
	  for (var key in vars) {
		if (vars.hasOwnProperty(key)) {
		  script.setUservar(username, key, vars[key]);
		}
	  }
	}
  
	// Get a reply from the bot.
	script
	  .reply(username, message, this)
	  .then(function (reply) {
		// Get all the user's vars back out of the script to include in the response.
		vars = script.getUservars(username);
  
		// Send the JSON response.
		res.json({
		  status: 'ok',
		  reply: reply,
		  vars: vars,
		});
	  })
	  .catch(function (err) {
		res.json({
		  status: 'error',
		  error: err,
		});
	  });
}

// All other routes shows the usage to test the /reply route.
function showUsage(req, res) {
	var egPayload = {
	  username: 'soandso',
	  message: 'Hello script',
	  vars: {
		name: 'Soandso',
	  },
	};
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write('Usage: curl -i \\\n');
	res.write('   -H "Content-Type: application/json" \\\n');
	res.write("   -X POST -d '" + JSON.stringify(egPayload) + "' \\\n");
	res.write('   http://localhost:3001/reply');
	res.end();
}
	
// Send a JSON error to the browser.
function error(res, message) {
	res.json({
	  status: 'error',
	  message: message,
	});
}

/*
app.get('/v2/tasks/', (req, res)=>{
	try{
		let myArrayOfTasks;
		if( undefined == (myArrayOfTasks = taskServiceInstance.getTasks() )){
			throw new Error("No tasks to get");
		}
		res.status(200).json(myArrayOfTasks);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});*/

//End point to get a task
/*app.get('/v2/tasks/:idddd', (req, res)=>{
	let id = req.params.idddd;
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			let myTask = taskServiceInstance.getTask(id);
			res.status(200).json(myTask);
		}
		catch(err){
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(404).send('NOT FOUND');
		}
	}
});*/
/*
app.delete('/v2/tasks/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		taskServiceInstance
			.removeTask(id)
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
*/
/*
//create a new task (POST HTTP method)
app.post('/v2/tasks/',(req,res)=>{
	let theTaskToAdd = req.body;
	taskServiceInstance
		.addTask(theTaskToAdd) 
		.then((returnString)=>{
			console.log(returnString);
			res.status(201).send('All is OK');
		})
		.catch((err)=>{
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(400).send('BAD REQUEST');
		});	
});
*/


app.post('/',(req,res)=>{
	console.log('cachalot');
	let theTaskToAdd = req.body;
	let title = req.body.title;
	let cerveau = req.body.cerveau;

	let newbot=Bot.create(title,cerveau);
	console.log(req.body);
	console.log(newbot);
	creer_bot();
	console.log('cachalot');
	
	res.status(201).send('All is OK');
	/*taskServiceInstance
		.addTask(theTaskToAdd) 
		.then((returnString)=>{
			console.log(returnString);
			res.status(201).send('All is OK');
		})
		.catch((err)=>{
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(400).send('BAD REQUEST');
		});	*/
});

/*
app.patch('/v2/tasks/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		taskServiceInstance
			.updateTask(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});*/
/*
app.put('/v2/tasks/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		taskServiceInstance
			.replaceTask(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});*/

/*
let id = Math.floor(Math.random() * Math.floor(100000)) ;
let randomPerson = await getRandomPerson();
let aTask ={ //UGLY
	'id':id,
	'title':'Random Title',
	'assignement':randomPerson
};*/
/*
TaskService.create(personServiceAccessPoint).then(ts=>{
	taskServiceInstance=ts;
	taskServiceInstance
		.addTask(aTask)
		.catch((err)=>{console.log(err);});
	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});*/

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});
//HELPER
/*
async function getRandomPerson(){
	let tempArray = await personServiceAccessPoint.getAllPersons();
	let key = Math.floor(Math.random() * tempArray.length) ;
	return tempArray[key];
}*/
/*
function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}
*/

