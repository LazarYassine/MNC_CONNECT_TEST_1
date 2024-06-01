import { TestBed } from '@angular/core/testing';

import { ServicsService } from './servics.service';

describe('ServicsService', () => {
  let service: ServicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
