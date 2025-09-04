import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionStatus } from './question-status';

describe('QuestionStatus', () => {
  let component: QuestionStatus;
  let fixture: ComponentFixture<QuestionStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
