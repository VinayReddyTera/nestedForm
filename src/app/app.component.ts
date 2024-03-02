/*
    This TypeScript code defines an Angular component named AppComponent.

    It imports necessary modules from Angular core and forms libraries.
*/

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
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
      name: ['Vinay',[Validators.required]], // A form control for 'name' initialized with 'Vinay'.
      email: ['abc@gmail.com'], // A form control for 'email' initialized with 'abc@gmail.com'.
      phoneNumbers: [[]], // A form control for 'phoneNumbers' initialized as an empty array.
      addressData : ['']
    });
  }

  // Method to handle form submission.
  submit() {
    console.log(this.dataForm.value); // Logs the form values to the console.
    this.apiservice.sendMessage(true)
    // Check if the dataForm is valid
    if (this.dataForm.valid) {
      // If valid, set success message
      this.successMessage = 'Successfully Submitted Form';
    } else {
      // If not valid, set error message
      this.errorMessage = 'Required Fields Missing';
      // Get all controls in the dataForm
      const controls = this.dataForm.controls;
      // Loop through each control
      for (const name in controls) {
        // Check if the control is invalid
        if (controls[name].invalid) {
          // Mark the control as dirty
          controls[name].markAsDirty();
        }
      }
    }
    // Set a timeout to clear error and success messages after 3 seconds
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }
}
