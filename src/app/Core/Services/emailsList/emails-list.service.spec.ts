import { TestBed } from '@angular/core/testing';

import { EmailsListService } from './emails-list.service';

describe('EmailsListService', () => {
  let service: EmailsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
