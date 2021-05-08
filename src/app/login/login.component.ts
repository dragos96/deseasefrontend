import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  username : string = '';
  password : string = '';

  ngOnInit(): void {
  }

  login(){
    console.log('logging in with: ', this.username, ' ', this.password);
  }

}
