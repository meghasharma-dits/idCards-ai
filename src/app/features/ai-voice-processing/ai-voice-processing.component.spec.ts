import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiVoiceProcessingComponent } from './ai-voice-processing.component';

describe('AiVoiceProcessingComponent', () => {
  let component: AiVoiceProcessingComponent;
  let fixture: ComponentFixture<AiVoiceProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiVoiceProcessingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiVoiceProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
