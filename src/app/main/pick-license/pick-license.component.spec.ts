import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickLicenseComponent } from './pick-license.component';

describe('PickLicenseComponent', () => {
  let component: PickLicenseComponent;
  let fixture: ComponentFixture<PickLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickLicenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
