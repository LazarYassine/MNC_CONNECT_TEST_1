import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailsListComponent } from './manage-emails-list.component';

describe('ManageEmailsListComponent', () => {
  let component: ManageEmailsListComponent;
  let fixture: ComponentFixture<ManageEmailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageEmailsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageEmailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
