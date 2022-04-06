import fetch from 'node-fetch';

class PersonService{  
  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3002
  }

  async getAllPersons(){
    let returnValue = new Array();
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `${this.url}:${this.port}`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfPersons = await response.json();
      for(let person of setOfPersons){
          returnValue.push(new PersonIdentifier({'personId':person.id}));
      }
      
    } catch (error) {
      console.log(error);
    }
    return returnValue;
  }

  async getPersonById(personId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new PersonIdentifier({'personId':id});
    //
    return returnValue;
  }

}



class PersonIdentifier{
  static personId = this.personId; //the id of the Person in the micro-service
  // TODO : when multiple sources of Persons is used : should differentiate personId and a localPersonId...
  constructor(data){ // TODO : Should check if sourceId is known and valid
      this.personId = data.personId
  }
  static isPersonIdentifier(anObject){
    // check if mandatory fields are there
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    // TODO : we should also check the property values (if are strings, etc ... as in constructor) 
    return hasMandatoryProperties;
  }
}



export {PersonIdentifier, PersonService}