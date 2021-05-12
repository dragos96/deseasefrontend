import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserDto } from './model/UserDto';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // TODO: declare globally
  private SERVER_PATH: string = 'http://localhost:9500';

  constructor(private httpClient: HttpClient, private securityService: SecurityService) { }

  findAll(): Observable<UserDto[]> {
    return this.httpClient.get<UserDto[]>(`${this.SERVER_PATH}/rest/users/all`, this.securityService.configureHeaderOptionsForOAuth());
  }
}