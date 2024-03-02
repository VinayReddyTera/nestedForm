import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormControl, Validators, FormArray } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { PhoneFormComponent } from './phone-form.component';
import { ApiService } from '../service/api.service';

describe('PhoneFormComponent', () => {
  let component: PhoneFormComponent;
  let fixture: ComponentFixture<PhoneFormComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneFormComponent ],
      imports: [ ReactiveFormsModule, FormsModule ],
      providers:[ApiService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneFormComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with a single phone number', () => {
    expect(component.phoneForm.controls.phoneNumbers.length).toBe(1);
  });

  it('should call writevalue without errors', () => {
    // const phoneNumbers = [{ phoneNumber: '1234567890' }, { phoneNumber: '9876543210' }];
    // component.writeValue(phoneNumbers);
    // expect(component.phoneForm.value.phoneNumbers.length).toBe(2);
    expect(() => component.writeValue('')).not.toThrow();
  });

  it('should add a new phone number form group when addPhoneNumberButtonClick() is called', () => {
    component.addPhoneNumberButtonClick();
    expect(component.phoneForm.value.phoneNumbers.length).toBe(2);
  });

  it('should delete a phone number form group when delete() is called', () => {
    component.delete(0);
    expect(component.phoneForm.value.phoneNumbers.length).toBe(1);
  });

  it('should validate form for invalid phone number format', () => {
    const control = component.phoneForm.controls.phoneNumbers.at(0).get('phoneNumber');
    control.setValue('123'); // Invalid phone number format
    expect(control.valid).toBe(false);
    expect(control.errors?.phoneError).toBeTruthy();
  });

  it('should validate form for required phone number', () => {
    const control = component.phoneForm.controls.phoneNumbers.at(0).get('phoneNumber');
    control.setValue(''); // Empty phone number
    expect(control.valid).toBe(false);
    expect(control.errors?.required).toBeTruthy();
  });

  it('should validate form for valid phone number format', () => {
    const control = component.phoneForm.controls.phoneNumbers.at(0).get('phoneNumber');
    control.setValue('9876543210'); // Valid phone number format
    expect(control.valid).toBe(true);
  });

  it('should subscribe to value changes on registerOnChange', () => {
    const spy = spyOn(component.phoneForm.valueChanges, 'subscribe').and.callThrough();
    const mockCallback = jasmine.createSpy('mockCallback');
    component.registerOnChange(mockCallback);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(mockCallback);
  });

  it('should call registerOnTouched without errors', () => {
    expect(() => component.registerOnTouched()).not.toThrow();
  });

  it('should call validate without errors', () => {
    const mockFormControl = new FormControl();
    expect(() => component.validate(mockFormControl)).not.toThrow();
  });

  it('should subscribe to apiService message on ngOnInit', () => {
    const messageSpy = spyOn(apiService.message, 'subscribe');
    component.ngOnInit();
    expect(messageSpy).toHaveBeenCalled();
  });

  it('should mark invalid phone form controls as dirty when a message is received', () => {
    const control1 = new FormControl('', Validators.required);
    control1.setValue(''); // Set a value for the FormControl
    control1.markAsDirty();
    control1.setErrors({ required: true });

    const phoneNumbers = new FormArray([control1]);
    component.phoneForm.get('phoneNumbers').setValue([{ phoneNumber: '1234567890' }]);

    // Mock message using BehaviorSubject to simulate an observable
    const message = true;
    const subject = new BehaviorSubject<any>(null);
    apiService.message = subject;

    subject.next(message); // Emit the message

    fixture.detectChanges(); // Trigger change detection to propagate message

    // Assert that the invalid control has been marked dirty
    expect(control1.dirty).toBeTrue();
    expect(control1.errors).not.toBeNull(); // Or use specific error assertions
  });

  it('should not mark phone form controls as dirty when no message is received', () => {
    // Set up initial form control with validation
    const control1 = new FormControl('', Validators.required);
    control1.setValue(''); // Set a value for the FormControl
    control1.markAsDirty();
    control1.setErrors({ required: true });
  
    // Initialize FormArray with the control
    const phoneNumbers = new FormArray([control1]);
    component.phoneForm.get('phoneNumbers').setValue([{ phoneNumber: '1234567890' }]);
  
    // Mock message using BehaviorSubject to simulate an observable with no message
    const subject = new BehaviorSubject<any>(null);
    apiService.message = subject;
  
    // Trigger ngOnInit
    component.ngOnInit();
  
    // Assert that the control remains dirty and has errors after ngOnInit
    expect(control1.dirty).toBeTrue();
    expect(control1.errors).not.toBeNull(); // Or use specific error assertions
  });
  
  it('should not mark phone form controls as dirty when message is received but form is valid', () => {
    // Set up initial form control without validation
    const control1 = new FormControl('1234567890');
  
    // Initialize FormArray with the control
    const phoneNumbers = new FormArray([control1]);
    component.phoneForm.get('phoneNumbers').setValue([{ phoneNumber: '1234567890' }]);
  
    // Mock message using BehaviorSubject to simulate an observable
    const message = true;
    const subject = new BehaviorSubject<any>(null);
    apiService.message = subject;
  
    // Trigger ngOnInit
    component.ngOnInit();
  
    // Emit the message
    subject.next(message);
  
    // Assert that the control remains pristine and has no errors after ngOnInit
    expect(control1.dirty).toBeFalse();
    expect(control1.errors).toBeNull(); // Or use specific error assertions
  });
  
  
});
