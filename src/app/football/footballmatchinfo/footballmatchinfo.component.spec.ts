import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballmatchinfoComponent } from './footballmatchinfo.component';

describe('FootballmatchinfoComponent', () => {
  let component: FootballmatchinfoComponent;
  let fixture: ComponentFixture<FootballmatchinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FootballmatchinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FootballmatchinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
