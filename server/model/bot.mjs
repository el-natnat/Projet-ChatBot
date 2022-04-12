import {PersonIdentifier} from "./Persons.mjs";

class Bot{
  
  static title = this.title;
  static cerveau  = this.cerveau;

  constructor(data){   //id,title,comment,tags
    if(undefined != data.title) {
      if(!isString(data.title)){
        throw new Error("Task Creation : passed Title is not a string");
      }
      this.title = data.title;
    } else {
      this.title = "";
    }
    /*if(undefined != data.startDate) {
      if(!isDate(data.startDate)){
        throw new Error("Task Creation : passed startDate is not a date");
      }
      this.startDate = data.startDate;
    } else {
      this.startDate = new Date();
    }*/

  }
  
  static async create(title, cerveau){ 
    return new Bot(title, cerveau);
  }
  static isBot(anObject){
    // check if mandatory fields are there
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    // we should also check the property values (if are strings, etc ... as in constructor) 
    return hasMandatoryProperties;
  }

  static isValidProperty(propertyName,propertyValue) {
    if(!this.hasOwnProperty(propertyName)){
      return false;
    }
    // we should also check the property values (if are strings, etc ... as in constructor) 
    return true;
  }

}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {
  return (typeof myVar === 'string' || myVar instanceof String) ;
}

function isDate (x) 
{ 
  return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate); 
}

function isArrayOfStrings(value){
  if(!Array.isArray(value)) return false;
  for(let item of value){
    if(!isString(item)) return false;
  }
  return true;
}

export {Bot}