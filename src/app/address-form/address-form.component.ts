/*
    This TypeScript code defines an Angular component named ChildComponent.

    It imports necessary modules from Angular core and forms libraries.
*/

import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  Validators,
  NG_VALIDATORS
} from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css'],
  providers: [
    // Provides NG_VALUE_ACCESSOR and NG_VALIDATORS to enable two-way data binding and form validation.
    { provide: NG_VALUE_ACCESSOR, useExisting: AddressFormComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: AddressFormComponent, multi: true }
  ]
})
export class AddressFormComponent implements ControlValueAccessor,OnInit {
  addressForm: any; // Defines a property to hold the form group.

  constructor(private fb: FormBuilder,protected apiservice:ApiService) {
    // Using Angular's FormBuilder service to create a form group
    this.addressForm = fb.group({
      // Defining form controls with initial values and validators
      address : ['',[Validators.required]], // 'address' form control with initial value '' and required validator
      pincode : ['',[Validators.required]]  // 'pincode' form control with initial value '' and required validator
    });
  }

  ngOnInit(): void {
    // Subscribe to the message observable provided by the ApiService
    this.apiservice.message.subscribe((message:any) => {
      // Check if a message is received
      if(message){
        // Check if the addressForm is not valid
        if(!this.addressForm.valid){
          // Get all controls in the addressForm
          const controls = this.addressForm.controls;
          // Loop through each control
          for(const name in controls) {
            // Check if the control is invalid
            if(controls[name].invalid) {
              // Mark the control as dirty
              controls[name].markAsDirty()
            }
          }
        }
      }
    });
  }  

  // convenience getter for easy access to form fields
  get f() { return this.addressForm.controls; }

  // Method to write form values into the form.
  writeValue(value: any): void {
    if(value) {
      this.addressForm.setValue(value);
    }
  }
  
  // Registers a callback function to be called when form values change.
  registerOnChange(fn: (value: any) => void) {
    this.addressForm.valueChanges.subscribe(fn);
  }

  // Registers a callback function to be called when the control is touched.
  registerOnTouched() {}

  // Method to validate the form.
  validate(c: FormControl) {
    return this.addressForm.valid ? null : { invalidForm: {valid: false }};
  }

}
