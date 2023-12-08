import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisMatchInfoComponent } from './tennis-match-info.component';

describe('TennisMatchInfoComponent', () => {
  let component: TennisMatchInfoComponent;
  let fixture: ComponentFixture<TennisMatchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TennisMatchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisMatchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

