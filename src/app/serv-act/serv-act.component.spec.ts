import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServActComponent } from './serv-act.component';

describe('ServActComponent', () => {
  let component: ServActComponent;
  let fixture: ComponentFixture<ServActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
