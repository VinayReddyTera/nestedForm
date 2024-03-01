import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send and receive messages', () => {
    const message = 'Test message';
    let receivedMessage: any;

    // Subscribe to the message
    const subscription = service.message.subscribe((msg: any) => {
      receivedMessage = msg;
    });

    // Send a message
    service.sendMessage(message);

    // Unsubscribe to prevent memory leaks
    subscription.unsubscribe();

    // Test
    expect(receivedMessage).toEqual(message);
  });
});
