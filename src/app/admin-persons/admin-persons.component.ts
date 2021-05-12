import { Component, OnInit } from '@angular/core';
import { PersonsService } from '../persons.service';
import { Person } from './../model/Person';
import { UserDto } from '../model/UserDto';
import { UsersService } from '../users.service';


@Component({
  selector: 'app-admin-persons',
  templateUrl: './admin-persons.component.html',
  styleUrls: ['./admin-persons.component.css']
})
export class AdminPersonsComponent implements OnInit {

  persons: Person[] = [];
  users : UserDto[] = [];
  // selectedParentMother? : Person;
  // selectedParentFather? : Person;
  currentPerson: Person = new Person();


  constructor(private personsService: PersonsService, private usersService : UsersService) { }

  ngOnInit(): void {
    this.personsService.findAll().subscribe(
      personsRez => {
        this.persons = personsRez;
      },
      err => {
        console.log('err: ', err);
      }
    )

    this.usersService.findAll().subscribe(
      rez => {
        this.users = rez;
        console.log('users: ', this.users);
      },
      err => {
        console.log('error: ', err);
      }
    );
  }

  savePerson(fn: string, ln: string) {
    console.log('saving: ', fn, ' ', ln);
    const np = new Person();
    np.firstName = fn;
    np.lastName = ln;
    this.personsService.save(np).subscribe(
      personSavedRez => {
        console.log('person saved: ', personSavedRez)
        this.persons.push(personSavedRez);
      },
      err => {
        console.log('person save error: ', err);
      }
    );
  }
  editPerson(p: Person) {
    console.log('editing person: ', p);
    this.currentPerson = p;
  }

  assignParent(selectedParent: Person, parentType: string) {

    // TODO: cannot self-assign
    // TODO: cannot create circular dependency
    console.log("assigning to: ", this.currentPerson);
    
    let cpId = this.currentPerson.id || -1;
    let selPId = selectedParent.id || -1;
    
    this.personsService.assignParent(cpId, parentType, selPId)
      .subscribe(
        rez => {
          console.log('associated parent to person: ', rez)
          if (parentType == 'mother') {
            console.log('assigning parent mother: ', selectedParent)
            this.currentPerson.mother = selectedParent;
          } else {
            console.log('assigning parent father: ', selectedParent)
            this.currentPerson.father = selectedParent;
          }
        },
        err => {
          console.log('error: ', err);
        }
      );
    // assignParent(idPerson : number, parentType : string, idParent : number)
  }

  // assignUser(idPerson : number, idUser : number) : Observable<Person>{

    assignUser(selectedUserAssociation: UserDto){
      console.log('associating: ', selectedUserAssociation);
      console.log('with: ', this.currentPerson);
      let cpId = this.currentPerson.id || -1;
      let userId = selectedUserAssociation.id || -1;

      this.personsService.assignUser(cpId, userId)
        .subscribe(
          rez => {
            console.log('associated user with person; result = ', rez);
          },
          err =>{
            console.log('error: ', err);
          }
        );
    }
}
