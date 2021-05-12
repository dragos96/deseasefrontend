import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {Person} from './model/Person';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  private SERVER_PATH : string = 'http://localhost:9500';

  constructor(private httpClient : HttpClient, private securityService : SecurityService) { }

  findAll(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(`${this.SERVER_PATH}/rest/persons/all`, this.securityService.configureHeaderOptionsForOAuth());
  }

  save(pers: Person) : Observable<Person>{
    return this.httpClient.post<Person>(`${this.SERVER_PATH}/rest/persons/save`, pers, this.securityService.configureHeaderOptionsForOAuthPOST());
  }

  assignParent(idPerson : number, parentType : string, idParent : number) : Observable<Person>{
    return this.httpClient.put<Person>(`${this.SERVER_PATH}/rest/persons/update/${idPerson}/${parentType}/${idParent}`, null, this.securityService.configureHeaderOptionsForOAuth());
  }

  assignUser(idPerson : number, idUser : number) : Observable<Person>{
    return this.httpClient.put<Person>(`${this.SERVER_PATH}/rest/persons/associate-with-user/${idPerson}/${idUser}`, null, this.securityService.configureHeaderOptionsForOAuth());
  }
  
}
