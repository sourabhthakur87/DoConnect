import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedQuestions } from './rejected-questions';

describe('RejectedQuestions', () => {
  let component: RejectedQuestions;
  let fixture: ComponentFixture<RejectedQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectedQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
