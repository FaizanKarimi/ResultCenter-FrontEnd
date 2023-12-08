import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IceHockeyHomeComponent } from './ice-hockey-home.component';

describe('IceHockeyHomeComponent', () => {
  let component: IceHockeyHomeComponent;
  let fixture: ComponentFixture<IceHockeyHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IceHockeyHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IceHockeyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

