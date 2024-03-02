import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ApiService } from './service/api.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    // Mock ApiService
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['sendMessage']);
    apiServiceSpy.sendMessage.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.dataForm.value.name).toEqual('Vinay');
    expect(component.dataForm.value.email).toEqual('abc@gmail.com');
    expect(component.dataForm.value.phoneNumbers.length).toEqual(0);
    expect(component.dataForm.value.addressData).toEqual('');
  });

  it('should submit form successfully when valid', fakeAsync(() => {
    spyOn(window.console, 'log');
    component.submit();
    tick();
    expect(window.console.log).toHaveBeenCalledWith(component.dataForm.value);
    expect(apiService.sendMessage).toHaveBeenCalledWith(true);
    expect(component.successMessage).toEqual('Successfully Submitted Form');
    expect(component.errorMessage).toEqual(undefined);
    tick(3001); // advance time to clear success message
    expect(component.successMessage).toEqual('');
  }));

  it('should display error message when form is invalid', fakeAsync(() => {
    spyOn(window.console, 'log');
    console.log('here')
    component.dataForm.get('name')?.setValue(''); // make name field invalid
    component.submit();
    tick();
    expect(window.console.log).toHaveBeenCalled();
    expect(apiService.sendMessage).toHaveBeenCalled();
    expect(component.successMessage).toEqual(undefined);
    expect(component.errorMessage).toEqual('Required Fields Missing');
    tick(3001); // advance time to clear error message
    expect(component.errorMessage).toBeFalsy();
  }));

  it('should display entered data in the table', () => {
    // Patch form values
    component.dataForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumbers: {phoneNumbers:[{ phoneNumber: '1234567890' }, { phoneNumber: '9876543210' }]},
      addressData: { address: '123 Main St', pincode: '12345' }
    });
  
    // Trigger change detection
    fixture.detectChanges();
  
    // Get compiled component
    const compiled = fixture.nativeElement;
  
    // Verify table exists
    expect(compiled.querySelector('table')).toBeTruthy();
  
    // Verify name
    const nameCell = compiled.querySelector('td#name');
    expect(nameCell).toBeTruthy();
    expect(nameCell.textContent.trim()).toEqual('John Doe');
  
    // Verify email
    const emailCell = compiled.querySelector('td#email');
    expect(emailCell).toBeTruthy();
    expect(emailCell.textContent.trim()).toEqual('john@example.com');
  
    // Verify phone numbers
    const phone0Cell = compiled.querySelector('td#phone0');
    expect(phone0Cell).toBeTruthy();
    expect(phone0Cell.textContent.trim()).toEqual('1234567890');
  
    const phone1Cell = compiled.querySelector('td#phone1');
    expect(phone1Cell).toBeTruthy();
    expect(phone1Cell.textContent.trim()).toEqual('9876543210');
  
    // Verify address
    const addressCell = compiled.querySelector('td#address');
    expect(addressCell).toBeTruthy();
    expect(addressCell.textContent.trim()).toEqual('123 Main St');
  
    // Verify pincode
    const pincodeCell = compiled.querySelector('td#pincode');
    expect(pincodeCell).toBeTruthy();
    expect(pincodeCell.textContent.trim()).toEqual('12345');
  });
});
