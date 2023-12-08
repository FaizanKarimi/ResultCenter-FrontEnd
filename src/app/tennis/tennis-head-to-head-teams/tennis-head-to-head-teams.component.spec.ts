import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisHeadToHeadTeamsComponent } from './tennis-head-to-head-teams.component';

describe('TennisHeadToHeadTeamsComponent', () => {
  let component: TennisHeadToHeadTeamsComponent;
  let fixture: ComponentFixture<TennisHeadToHeadTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TennisHeadToHeadTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisHeadToHeadTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
