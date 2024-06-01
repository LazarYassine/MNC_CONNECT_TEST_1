import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyShowcaseComponent } from './company-showcase.component';

describe('CompanyShowcaseComponent', () => {
  let component: CompanyShowcaseComponent;
  let fixture: ComponentFixture<CompanyShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyShowcaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
