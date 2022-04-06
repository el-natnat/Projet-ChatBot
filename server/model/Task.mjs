import {PersonIdentifier} from "./Persons.mjs";

class Task{
  
  static id = this.id;
  static title = this.title;
  static startDate  = this.startDate;
  static endDate  = this.endDate;
  static status  = this.status;
  static tags  = this.tags;
  static assignement = this.assignement; // NEW : to whom this task is asigned?

  constructor(data){   //id,title,comment,tags
    if(undefined != data.id) {
      if(!isInt(data.id)){
        throw new Error("Task Creation : passed Id is not an integer");
      }
      this.id = data.id;
    } else {
      this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
    }
    if(undefined != data.title) {
      if(!isString(data.title)){
        throw new Error("Task Creation : passed Title is not a string");
      }
      this.title = data.title;
    } else {
      this.title = "";
    }
    if(undefined != data.startDate) {
      if(!isDate(data.startDate)){
        throw new Error("Task Creation : passed startDate is not a date");
      }
      this.startDate = data.startDate;
    } else {
      this.startDate = new Date();
    }
    if(undefined != data.endDate) {
      if(!isDate(data.endDate)){
        throw new Error("Task Creation : passed endDate is not a date");
      }
      this.endDate = data.endDate;
    } else {
      this.endDate = new Date();
    }
    if(undefined != data.status) {
      if(!isString(data.status)){
        throw new Error("Task Creation : passed status is not a string");
      }
      this.status = data.status;
    } else {
      this.status = "";
    }
    if(undefined != data.tags) {
      if(!isArrayOfStrings(data.tags)){
        throw new Error("Task Creation : passed tags is not an array of strings");
      }
      this.tags = data.tags;
    } else {
      this.tags = new Array();
    }
    //
    if(undefined != data.assignement) {
      if(!PersonIdentifier.isPersonIdentifier(data.assignement)){
        throw new Error("Task Creation : passed assignement is not a Person identifier");
      }
      this.assignement = data.assignement;
    } else {
      // dummy Value
      let id = Math.floor(Math.random() * Math.floor(100000)) ;
      let sourceId = Math.floor(Math.random() * Math.floor(100000)) ;
      let returnValue = new PersonIdentifier({'id':id,'sourceId':sourceId,'personId':1});
      //
      this.assignement = returnValue;
    }

  }

  static isTask(anObject){
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

export {Task}