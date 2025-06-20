import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTableComponent } from './advance-table.component';

describe('AdvanceTableComponent', () => {
  let component: AdvanceTableComponent;
  let fixture: ComponentFixture<AdvanceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
