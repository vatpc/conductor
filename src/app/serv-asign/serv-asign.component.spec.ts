import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServAsignComponent } from './serv-asign.component';

describe('ServAsignComponent', () => {
  let component: ServAsignComponent;
  let fixture: ComponentFixture<ServAsignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServAsignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
