import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnswer } from './add-answer';

describe('AddAnswer', () => {
  let component: AddAnswer;
  let fixture: ComponentFixture<AddAnswer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAnswer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAnswer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
