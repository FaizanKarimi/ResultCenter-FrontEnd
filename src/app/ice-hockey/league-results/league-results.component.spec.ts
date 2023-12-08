import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueResultsComponent } from './league-results.component';

describe('LeagueResultsComponent', () => {
  let component: LeagueResultsComponent;
  let fixture: ComponentFixture<LeagueResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

