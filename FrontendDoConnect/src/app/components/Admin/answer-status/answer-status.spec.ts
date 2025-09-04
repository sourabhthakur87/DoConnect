import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerStatus } from './answer-status';

describe('AnswerStatus', () => {
  let component: AnswerStatus;
  let fixture: ComponentFixture<AnswerStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnswerStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
