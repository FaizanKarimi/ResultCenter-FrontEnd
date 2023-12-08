import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueResultListComponent } from './league-result-list.component';

describe('LeagueResultListComponent', () => {
  let component: LeagueResultListComponent;
  let fixture: ComponentFixture<LeagueResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
