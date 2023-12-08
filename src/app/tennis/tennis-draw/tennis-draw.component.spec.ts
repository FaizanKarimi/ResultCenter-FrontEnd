import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisDrawComponent } from './tennis-draw.component';

describe('TennisDrawComponent', () => {
  let component: TennisDrawComponent;
  let fixture: ComponentFixture<TennisDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TennisDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
