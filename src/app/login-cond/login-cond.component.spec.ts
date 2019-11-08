import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCondComponent } from './login-cond.component';

describe('LoginCondComponent', () => {
  let component: LoginCondComponent;
  let fixture: ComponentFixture<LoginCondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginCondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
