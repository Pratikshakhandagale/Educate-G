import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgMapComponent } from './ag-map.component';

describe('AgMapComponent', () => {
  let component: AgMapComponent;
  let fixture: ComponentFixture<AgMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
