import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PhoneFormComponent } from './phone-form.component';

describe('PhoneFormComponent', () => {
  let component: PhoneFormComponent;
  let fixture: ComponentFixture<PhoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneFormComponent ],
      imports: [ ReactiveFormsModule, FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with a single phone number', () => {
    expect(component.phoneForm.controls.phoneNumbers.length).toBe(1);
  });

  it('should correctly initialize form with provided phone numbers', () => {
    const phoneNumbers = [{ phoneNumber: '1234567890' }, { phoneNumber: '9876543210' }];
    component.writeValue({ phoneNumbers });
    expect(component.phoneForm.value.phoneNumbers.length).toBe(2);
  });

  it('should add a new phone number form group when addPhoneNumberButtonClick() is called', () => {
    component.addPhoneNumberButtonClick();
    expect(component.phoneForm.value.phoneNumbers.length).toBe(2);
  });

  it('should delete a phone number form group when delete() is called', () => {
    component.delete(0);
    expect(component.phoneForm.value.phoneNumbers.length).toBe(0);
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

  // Add more test cases for form validation, message subscription, touch handling, etc.
});
