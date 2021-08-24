import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }
  username: string = "pavan";
  password: string = "pavan";
  duration: any;
  ngOnInit(): void {
  }
  login() {
    let date = new Date();
    let d = (this.duration*1000).toString();
    
    localStorage.setItem("time", d);
    location.href="home"
  }
}
