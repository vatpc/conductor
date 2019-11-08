import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentesComponent } from './urgentes.component';

describe('UrgentesComponent', () => {
  let component: UrgentesComponent;
  let fixture: ComponentFixture<UrgentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
