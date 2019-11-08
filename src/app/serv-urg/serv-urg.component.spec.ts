import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServUrgComponent } from './serv-urg.component';

describe('ServUrgComponent', () => {
  let component: ServUrgComponent;
  let fixture: ComponentFixture<ServUrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServUrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServUrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
