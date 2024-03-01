/*
    This TypeScript code defines an Angular component named ChildComponent.

    It imports necessary modules from Angular core and forms libraries.
*/

import { Component, forwardRef, OnInit } from '@angular/core';
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
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AddressFormComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => AddressFormComponent), multi: true }
  ]
})
export class AddressFormComponent implements ControlValueAccessor,OnInit {
  addressForm: any; // Defines a property to hold the form group.

  constructor(private fb: FormBuilder,private apiservice:ApiService) {
    // Using Angular's FormBuilder service to create a form group
    this.addressForm = fb.group({
      // Defining form controls with initial values and validators
      address : ['',[Validators.required]], // 'address' form control with initial value '' and required validator
      pincode : ['',[Validators.required]]  // 'pincode' form control with initial value '' and required validator
    });
  }

  ngOnInit(): void {
    this.apiservice.message.subscribe((message:any) => {
      if(message){
        if(!this.addressForm.valid){
          const controls = this.addressForm.controls;
          for(const name in controls) {
            if(controls[name].invalid) {
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
