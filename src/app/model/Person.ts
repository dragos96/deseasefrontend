import { IPropertyObservable } from 'yfiles'


export class Person{
    private listeners = []

   

    firstName? : string;
    lastName?: string;
    id : number;
    mother? : Person;
    father? : Person;

    constructor(nodeData : any){
        this.id = nodeData['id'];
        this.firstName = nodeData['firstName'];
        this.lastName = nodeData['lastName'];
    }
    
    get name(){
        return this.lastName + ' ' + this.firstName;
    }
}