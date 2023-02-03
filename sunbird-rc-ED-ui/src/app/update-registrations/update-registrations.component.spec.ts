import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRegistrationsComponent } from './update-registrations.component';

describe('UpdateRegistrationsComponent', () => {
  let component: UpdateRegistrationsComponent;
  let fixture: ComponentFixture<UpdateRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRegistrationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
