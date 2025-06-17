import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailLinkingComponent } from './mail-linking.component';

describe('MailLinkingComponent', () => {
  let component: MailLinkingComponent;
  let fixture: ComponentFixture<MailLinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailLinkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
