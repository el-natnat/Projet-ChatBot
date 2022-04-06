import {Task} from "./Task.mjs";


class TaskService{
	constructor(data){ 
		this.array = new Array();
		this.db = {};
	}

	static async create(){ 
		return new TaskService();
	}

	async addTask(anObject){
		let newTask;
		try{
  			newTask = new Task(anObject);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.array.push(newTask);
		return `added task of id ${newTask.id}`;
	}

	//from PUT
	async replaceTask(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Task
			if(Task.isTask(anObject)){
				/// Just replace it already!
				this.array.splice(index,1,anObject);
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Task : ${anObject}`);
		}
		throw new Error(`cannot find task of id ${id}`);
	}

	//from PATCH
	async updateTask(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Task
			for(let property in anObject){
				if(!Task.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Task property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.array)[index][property] = anObject[property];
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find task of id ${id}`);
	}

	async removeTask(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.array.splice(index,1);
			return `removed task of id ${id}`;
		}
		throw new Error(`cannot find task of id ${id}`);
		
	}

	getTask(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.array)[index];
		}
		throw new Error(`cannot find task of id ${id}`);	
	}

	getTasks(){
		return this.array;
	}

}

export {TaskService}