import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisStatComponent } from './tennis-stat.component';

describe('TennisStatComponent', () => {
  let component: TennisStatComponent;
  let fixture: ComponentFixture<TennisStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TennisStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
