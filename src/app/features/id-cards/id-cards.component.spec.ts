import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdCardsComponent } from './id-cards.component';

describe('IdCardsComponent', () => {
  let component: IdCardsComponent;
  let fixture: ComponentFixture<IdCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
