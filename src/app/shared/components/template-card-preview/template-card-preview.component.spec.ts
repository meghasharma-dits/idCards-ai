import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateCardPreviewComponent } from './template-card-preview.component';

describe('TemplateCardPreviewComponent', () => {
  let component: TemplateCardPreviewComponent;
  let fixture: ComponentFixture<TemplateCardPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateCardPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateCardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
