import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasktetBallHomeComponent } from './basktet-ball-home.component';

describe('BasktetBallHomeComponent', () => {
  let component: BasktetBallHomeComponent;
  let fixture: ComponentFixture<BasktetBallHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasktetBallHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasktetBallHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
