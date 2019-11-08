import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetSerComponent } from './det-ser.component';

describe('DetSerComponent', () => {
  let component: DetSerComponent;
  let fixture: ComponentFixture<DetSerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetSerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetSerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
