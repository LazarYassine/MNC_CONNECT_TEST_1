import { TestBed } from '@angular/core/testing';

import { EmailCategoryService } from './email-category.service';

describe('EmailCategoryService', () => {
  let service: EmailCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
