import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedQuestion } from './approved-question';

describe('ApprovedQuestion', () => {
  let component: ApprovedQuestion;
  let fixture: ComponentFixture<ApprovedQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedQuestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
