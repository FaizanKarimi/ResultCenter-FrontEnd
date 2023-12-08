import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisHeadToHeadComponent } from './tennis-head-to-head.component';

describe('TennisHeadToHeadComponent', () => {
  let component: TennisHeadToHeadComponent;
  let fixture: ComponentFixture<TennisHeadToHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TennisHeadToHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisHeadToHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
