import { TestBed } from '@angular/core/testing';

import { NetworkCategoryService } from './network-category.service';

describe('NetworkCategoryService', () => {
  let service: NetworkCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
