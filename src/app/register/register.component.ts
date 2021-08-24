import { ModalComponent } from './../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { states } from '../../shared/states'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private snackbar: MatSnackBar,
     private http: HttpClient) { }
  register: FormGroup; 
  courses: string[] = [];
  states: any[] = [];
  course: string = ""
  show: boolean = false;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'email': '',
    'mobilenumber': '',
    'city': '',
    'state': '',
    'pincode': '',
    'courses': '',
    
  }
  validationMsgs = {
    'firstname': {
      'required': "Required"
    },
    'lastname': {
      'required': "Required"
    },
    'email': {
      'required': "Required",
      'email': 'Enter a valid email id'
    },
    'mobilenumber': {
      'required': "Mobile number required",
      'minlength': "Must be 10 digit",
      'maxlength': "Must be 10 digit"
    },
    'city': {
      'required': "Required"
    },
    'state': {
      'required': "Required"
    },
    'pincode': {
      'required': "Required",
      'minlength': "Must be 6 digit",
      'maxlength': "Must be 6 digit"
    },
   
    'courses': {
      'required': "Type atleast one course"
    }
  }
  ngOnInit(): void {
    this.states = states;
    this.show = false;
    this.courses = []
    this.register = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobilenumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      courses: [this.courses],
      queries: ['', ],
      pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
    this.register.valueChanges.subscribe(data => this.onValueChanged(data))
  }
  onValueChanged(data? : any) {
    if (!this.register) {
      return;
    }
    const form = this.register;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previuos error messages if any
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMsgs[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key];
            }
          }
        }
      }
    }
  }

  addCourse(event: any) {      
    this.courses.push(event)
    this.course = ""
    console.log(this.course);    
  }
  remove(course: string) {
    for(var i=0; i<this.courses.length; i++) {
      if(this.courses[i] == course) {
        this.courses.splice(i, 1);
        break;
      }
    }
  }
  signup() {
    this.show = true
    let data = this.register.value;
    let c = ""
    for(var i=0; i<this.courses.length-1; i++) {
      c += this.courses[i] + ",";
    }
    c+= this.courses[this.courses.length-1]
    data.courses = c;
    console.log(data);
    
    this.http.post("https://codeforfun1.herokuapp.com/api/signup", data)
    .subscribe((res: any) => {
      console.log(res)
      if(res.status = "success") {
        this.show = false;
        this.dialog.open(ModalComponent, {
          
          height: '350px',
          width: '250px',
          disableClose: true,      
        })
        .afterClosed().subscribe(res => {
          this.ngOnInit();
        })
      }
    }, err => console.log(err))
  }
}
