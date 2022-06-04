import {Bot} from "./Bot.mjs";
import {Low, JSONFile} from 'lowdb';
import fs from 'express'


class BotService{
	constructor(){ 
		this.db = {};
		
	}

	static async create(botServiceAccessPoint){ 
		const service = new BotService();
		const adapter = new JSONFile("db.json");
		service.db = new Low(adapter);
		await service.db.read();
		service.db.data = service.db.data || { bots: [] } //if db is null, create it.
		
		return service;
	}

	async addBot(anObject){
		console.log("Yeah")
		let newBot;
		try{
			newBot = new Bot(anObject);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.db.data.bots.push(newBot);
		await this.db.write();
		console.log("Fin")
		return `added bot of id ${newBot.id}`;
		
	}

	//from PUT
	async replaceBot(id, anObject){
		let index = this.db.data.bots.findIndex(e=> e.id == id);		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Bot
			if(Bot.isBot(anObject)){
				/// Just replace it already!
				this.db.data.bots.splice(index,1,anObject);
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Bot : ${anObject}`);
		}
		throw new Error(`cannot find Bot of id ${id}`);
	}

	//from PATCH
	async updateBot(id, anObject){
		let index = this.db.data.bots.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Bot
			for(let property in anObject){
				if(!Bot.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Bot property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.db.data.bots)[index][property] = anObject[property];
			}
			await this.db.write();
			return "Done UPDATING";
		}
		throw new Error(`cannot find Bot of id ${id}`);
	}

	async removeBot(id){
		let index = this.db.data.bots.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.db.data.bots.splice(index,1);
			await this.db.write();
			return `removed Bot of id ${id}`;
		}
		throw new Error(`cannot find Bot of id ${id}`);
		
	}

	getBot(id){
		let index = this.db.data.bots.findIndex(e=> e.id == id);
		if(index >-1 ){
			return (this.db.data.bots)[index];
		}
		throw new Error(`cannot find Bot of id ${id}`);	
	}

	getBots(){
		return this.db.data.bots;
	}

}

export {BotService}