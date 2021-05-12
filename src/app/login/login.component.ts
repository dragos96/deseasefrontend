import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private securityService: SecurityService, private router: Router) { }

  username : string = '';
  password : string = '';

  ngOnInit(): void {
  }

  

  login(){
    console.log('Loggin in with: ' + this.username + ' and ' +  this.password);
    let loginRequest: Observable<Object> = this.securityService.login( this.username,  this.password);
    loginRequest.subscribe(rez => {
      console.log('authentication result: ', rez);
      this.securityService.saveToken(rez);
      this.router.navigate(['/graph']);
    },
      err => {
        console.log('unsuccessful login');
        console.log(err);
      });
    }

}
