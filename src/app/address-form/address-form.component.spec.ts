import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddressFormComponent } from './address-form.component';
import { of } from 'rxjs';
import { ApiService } from '../service/api.service';

// Mock ApiService
class MockApiService {
  message = of({});
}

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressFormComponent ],
      imports: [ ReactiveFormsModule, FormsModule ],
      providers: [
        // Provide the mock ApiService
        { provide: ApiService, useClass: MockApiService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty address and pincode', () => {
    expect(component.addressForm.value.address).toBe('');
    expect(component.addressForm.value.pincode).toBe('');
  });

  it('should set form values correctly when writeValue() is called', () => {
    const address = '123 Main St';
    const pincode = '12345';
    component.writeValue({ address, pincode });
    expect(component.addressForm.value.address).toBe(address);
    expect(component.addressForm.value.pincode).toBe(pincode);
  });

  it('should mark address field as dirty and invalid when it is touched and left empty', () => {
    const addressControl = component.addressForm.controls.address;
    addressControl.markAsTouched();
    addressControl.setValue('');
    expect(addressControl.invalid).toBeTruthy();
    expect(addressControl.errors?.required).toBeTruthy();
  });

  it('should mark pincode field as dirty and invalid when it is touched and left empty', () => {
    const pincodeControl = component.addressForm.controls.pincode;
    pincodeControl.markAsTouched();
    pincodeControl.setValue('');
    expect(pincodeControl.invalid).toBeTruthy();
    expect(pincodeControl.errors?.required).toBeTruthy();
  });

  it('should validate form as invalid when either field is left empty', () => {
    const addressControl = component.addressForm.controls.address;
    const pincodeControl = component.addressForm.controls.pincode;
    addressControl.setValue('123 Main St');
    pincodeControl.setValue('');
    expect(component.addressForm.invalid).toBeTruthy();
  });

  it('should validate form as valid when both fields have valid values', () => {
    const addressControl = component.addressForm.controls.address;
    const pincodeControl = component.addressForm.controls.pincode;
    addressControl.setValue('123 Main St');
    pincodeControl.setValue('12345');
    expect(component.addressForm.valid).toBeTruthy();
  });

  // Add more test cases as needed for further scenarios.
});
