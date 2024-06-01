import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCompanyProfileComponent } from './shared-company-profile.component';

describe('SharedCompanyProfileComponent', () => {
  let component: SharedCompanyProfileComponent;
  let fixture: ComponentFixture<SharedCompanyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedCompanyProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
