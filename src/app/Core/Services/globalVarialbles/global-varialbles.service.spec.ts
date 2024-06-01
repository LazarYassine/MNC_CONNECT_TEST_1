import { TestBed } from '@angular/core/testing';

import { GlobalVarialblesService } from './global-varialbles.service';

describe('GlobalVarialblesService', () => {
  let service: GlobalVarialblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalVarialblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
