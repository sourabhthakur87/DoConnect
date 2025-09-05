import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedAnswers } from './rejected-answers';

describe('RejectedAnswers', () => {
  let component: RejectedAnswers;
  let fixture: ComponentFixture<RejectedAnswers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectedAnswers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedAnswers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
