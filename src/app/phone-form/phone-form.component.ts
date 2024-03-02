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
  NG_VALIDATORS,
  FormArray
} from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-phone-form', // Specifies the component's selector used in HTML.
  templateUrl: './phone-form.component.html', // Specifies the HTML template file for the component.
  styleUrls: ['./phone-form.component.css'], // Specifies the CSS style files for the component.
  providers: [
    // Provides NG_VALUE_ACCESSOR and NG_VALIDATORS to enable two-way data binding and form validation.
    { provide: NG_VALUE_ACCESSOR, useExisting: PhoneFormComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: PhoneFormComponent, multi: true }
  ]
})

export class PhoneFormComponent implements ControlValueAccessor,OnInit {
  phoneForm: any; // Defines a property to hold the form group.
  private onChange: any = () => {}; // Defines a callback function for value changes.
  phoneNumbers: FormArray; // Defines a property to hold the FormArray for phone numbers.

  constructor(private fb: FormBuilder,private apiservice:ApiService) {
    // Initializes the phoneForm FormGroup with an initial phoneNumbers FormArray.
    this.phoneForm = fb.group({
      phoneNumbers: fb.array([this.addPhoneNumberFormGroup()])
    });
  }

  ngOnInit(): void {
    // Subscribe to the message observable provided by the ApiService
    this.apiservice.message.subscribe((message:any) => {
      // Check if a message is received
      if(message){
        // Check if the phoneForm is not valid
        if(!this.phoneForm.valid){
          // Check if there are phone numbers in the form
          if(this.phoneForm.value.phoneNumbers.length > 0){
            // Extract controls from the phoneNumbers FormArray
            const arrayControls = [
              this.phoneForm.controls.phoneNumbers.controls
            ];
            // Loop through the controls array
            for (let i in arrayControls) {
              for (let j in arrayControls[i]) {
                // Iterate over each control in the control group
                for (const name in arrayControls[i][j].controls) {
                  // Check if the control is invalid
                  if (arrayControls[i][j].controls[name].invalid) {
                    // Mark the control as dirty
                    arrayControls[i][j].controls[name].markAsDirty();
                  }
                }
              }
            }
          }
        }
      }
    });
  }
  

  // Method to write form values into the form.
  writeValue(value: any): void {
  }
  
  // Registers a callback function to be called when form values change.
  registerOnChange(fn: (value: any) => void) {
    this.phoneForm.valueChanges.subscribe(fn);
    this.onChange = fn;
  }
  
  // Registers a callback function to be called when the control is touched.
  registerOnTouched() {}

  // Method to validate the form.
  validate(c: FormControl) {
    return this.phoneForm.valid ? null : { invalidForm: {valid: false }};
  }

  // Custom validation method to validate phone numbers.
  validatePhone(c: FormControl): { phoneError: { message: string; } } | null {
     // Regular expression for Indian phone number validation.
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    return phoneRegex.test(c.value) ? null : {
      phoneError: {
        message: 'Invalid Indian Mobile No format!' // Error message for invalid phone number format.
      }
    };
  }

  // Method to add a new phone number form group to the phoneNumbers FormArray.
  addPhoneNumberFormGroup() {
    return this.fb.group({
      phoneNumber: ['', [Validators.required, this.validatePhone]], // Adds a form control for phone number.
    });
  }

  // Method to handle click event for adding a new phone number form group.
  addPhoneNumberButtonClick(): void {
    (<FormArray>this.phoneForm.get('phoneNumbers')).push(
      this.addPhoneNumberFormGroup()
    );
    this.onChange(this.phoneForm.value); // Calls the onChange callback with updated form values.
  }

  // Method to delete a phone number form group from the phoneNumbers FormArray.
  delete(index: any) {
    (<FormArray>this.phoneForm.get('phoneNumbers')).removeAt(index); // Removes the form group at specified index.
    if (this.phoneForm.value.phoneNumbers.length == 0) {
      // Adds a new phone number form group if there are no phone numbers left after deletion.
      (<FormArray>this.phoneForm.get('phoneNumbers')).push(
        this.addPhoneNumberFormGroup()
      );
    }
  }
}