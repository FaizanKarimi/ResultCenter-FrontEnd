import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisHeadToHeadResultsComponent } from './tennis-head-to-head-results.component';

describe('TennisHeadToHeadResultsComponent', () => {
  let component: TennisHeadToHeadResultsComponent;
  let fixture: ComponentFixture<TennisHeadToHeadResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TennisHeadToHeadResultsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisHeadToHeadResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

