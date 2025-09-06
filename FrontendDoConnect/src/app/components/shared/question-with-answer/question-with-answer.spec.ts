import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionWithAnswer } from './question-with-answer';

describe('QuestionWithAnswer', () => {
  let component: QuestionWithAnswer;
  let fixture: ComponentFixture<QuestionWithAnswer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionWithAnswer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionWithAnswer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
