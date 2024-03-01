/*
    This TypeScript code defines an Angular component named AppComponent.

    It imports necessary modules from Angular core and forms libraries.
*/

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Declares a property 'dataForm' of type FormGroup.
  dataForm: FormGroup;
  errorMessage:string|undefined;
  successMessage:string|undefined;

  // Constructor function to initialize the component.
  constructor(private fb: FormBuilder,private apiservice:ApiService) {
    // Initializes 'dataForm' using FormBuilder to create a FormGroup with initial form controls and values.
    this.dataForm = fb.group({
      name: ['Vinay'], // A form control for 'name' initialized with 'Vinay'.
      email: ['abc@gmail.com'], // A form control for 'email' initialized with 'abc@gmail.com'.
      phoneNumbers: [[]], // A form control for 'phoneNumbers' initialized as an empty array.
      addressData : []
    });
  }

  // A getter method to access the 'phoneNumbers' FormArray within the 'dataForm'.
  get phoneNumbers() {
    return this.dataForm.get('phoneNumbers') as FormArray;
  }

  // Method to handle form submission.
  submit() {
    console.log(this.dataForm.value); // Logs the form values to the console.
    this.apiservice.sendMessage(true)
    // Checks if the form is valid.
    if (this.dataForm.valid) {
      this.successMessage = 'Successfully Submitted Form';
    } else {
      this.errorMessage = 'Required Fields Missing'
      const controls = this.dataForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          controls[name].markAsDirty()
        }
      }
    }
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }
}
