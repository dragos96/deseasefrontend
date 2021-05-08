import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private SERVER_PATH : string = 'http://localhost:9500';

  constructor(private httpClient: HttpClient) { }


  urlAT() {
    return '?access_token=' + localStorage.getItem("access_token");
  }

  /**
   * Method which calls the server security entpoint - /oauth/token
   * in order to obtain a valid OAuth token to use for further
   * secured enpoint access
   * @param username 
   * @param password 
   */
  obtainAccessToken(username: string, password: string): Observable<Object> {

    const requestParameters = {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: 'my-client'
    };

    let headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa("my-client:my-secret")
      });

    const options = {
      headers: headers,
      params: requestParameters
    }

    return this.httpClient.post(`${this.SERVER_PATH}/oauth/token`, requestParameters, options);
  }

  saveToken(token : any) {
    localStorage.setItem("access_token", token.access_token);
  }


  configureHeaderOptionsForOAuthPOST() {
    let headers =
      new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem("access_token")
      });
    const options = {
      headers: headers
    }
    return options;
  }

  /**
   * Method used in order to build header options
   * containing the user token in the form of
   * an authorization header
   */
  configureHeaderOptionsForOAuth() {
    let headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem("access_token")
      });
    const options = {
      headers: headers
    }
    return options;
  }

  whoAmI() {
    return this.httpClient.get<string>(`${this.SERVER_PATH}/rest/users/whoami`, this.configureHeaderOptionsForOAuth());
  }

  register(usernameRegister: string, passwordRegister: string, emailRegister: string): Observable<Object> {
    let object = {
      "username": usernameRegister,
      "password": passwordRegister,
      "email": emailRegister
    }
    let headers =
      new HttpHeaders({
        // 'Content-type': 'application/json',
        'Authorization': 'Basic ' + btoa("my-client:my-secret")
      });
    const options = {
      headers: headers
    }
    return this.httpClient.post<any>(`${this.SERVER_PATH}/security/users/register`, object); //  object, options
  }

  login(username: string, password: string): Observable<Object> {
    return this.obtainAccessToken(username, password);
  }

  getLoggedInUser() {
    console.log('getting logged in user')
    let loggedInUser = {
      access_token: localStorage.getItem('access_token'),
      user_id: localStorage.getItem('user_id')
    };
    return loggedInUser;
  }
}
