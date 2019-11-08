import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAleComponent } from './new-ale.component';

describe('NewAleComponent', () => {
  let component: NewAleComponent;
  let fixture: ComponentFixture<NewAleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
