import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketBallMatchInfoComponent } from './basket-ball-match-info.component';

describe('BasketBallMatchInfoComponent', () => {
  let component: BasketBallMatchInfoComponent;
  let fixture: ComponentFixture<BasketBallMatchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasketBallMatchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketBallMatchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
