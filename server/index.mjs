import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {TaskService} from "./model/TaskService_LowDbImpl.mjs";
//import {TaskService} from "./model/TaskService_ArrayImpl.mjs";
let taskServiceInstance;

import {PersonIdentifier,PersonService} from "./model/Persons.mjs";
let personServiceAccessPoint = new PersonService({url:"http://localhost",port:3002});
//Question : How do I assigne a task to a person? : It is a PATCH to a Task...


const app = express();


//// Enable ALL CORS request
app.use(cors())
////




const port = 3001

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

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
});

//End point to get a task
app.get('/v2/tasks/:idddd', (req, res)=>{
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
});

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
});

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
});


let id = Math.floor(Math.random() * Math.floor(100000)) ;
let randomPerson = await getRandomPerson();
let aTask ={ //UGLY
	'id':id,
	'title':'Random Title',
	'assignement':randomPerson
};

TaskService.create(personServiceAccessPoint).then(ts=>{
	taskServiceInstance=ts;
	taskServiceInstance
		.addTask(aTask)
		.catch((err)=>{console.log(err);});
	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});

//HELPER
async function getRandomPerson(){
	let tempArray = await personServiceAccessPoint.getAllPersons();
	let key = Math.floor(Math.random() * tempArray.length) ;
	return tempArray[key];
}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}


