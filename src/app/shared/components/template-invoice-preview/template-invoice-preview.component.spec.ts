import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateInvoicePreviewComponent } from './template-invoice-preview.component';

describe('TemplateInvoicePreviewComponent', () => {
  let component: TemplateInvoicePreviewComponent;
  let fixture: ComponentFixture<TemplateInvoicePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateInvoicePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateInvoicePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
