import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberChipsComponent } from './number-chips.component';

describe('NumberChipsComponent', () => {
  let component: NumberChipsComponent;
  let fixture: ComponentFixture<NumberChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberChipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
