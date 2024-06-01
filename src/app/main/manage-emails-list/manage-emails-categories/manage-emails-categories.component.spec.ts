import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailsCategoriesComponent } from './manage-emails-categories.component';

describe('ManageEmailsCategoriesComponent', () => {
  let component: ManageEmailsCategoriesComponent;
  let fixture: ComponentFixture<ManageEmailsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageEmailsCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageEmailsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
