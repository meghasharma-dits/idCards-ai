import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/configs/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../../core/services/spinner.service';
import { finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-ai-voice-processing',
  imports: [ReactiveFormsModule, 
    InputTextModule, 
    FloatLabel, 
    FormsModule, 
    SelectModule, 
    FileUploadModule,
    TextareaModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './ai-voice-processing.component.html',
  styleUrl: './ai-voice-processing.component.scss'
})
export class AiVoiceProcessingComponent {
  @ViewChild('audioPlayer') audioPlayer: any;
  audioSrc: string = 'assets/audio/sample.mp3'; // Path to your audio file
  allVoices: any = [
    { name: 'Voice 1', id: 1, audio:'' },];
  formGroup!: FormGroup;
  voicesList: any[] = [
    { name: 'Voice 1', id: 1, audio: '' }, ]

    constructor(
        private http: HttpClient,
        private spinnerService: SpinnerService,
      ){
        this.getExistingVoices();
      }
    ngOnInit() {
        this.formGroup = new FormGroup({
          voice_name: new FormControl<string | null>(null),
          voice_text: new FormControl<string | null>(null),
          voice_id: new FormControl<string | null>(null),
          file: new FormControl<any>(null)
        });
    }

    getExistingVoices() {
          this.spinnerService.show();
          this.http.get(environment.apiUrl + ApiEndpoints.existingVoices)
          .pipe(
            finalize(() => this.spinnerService.hide())
          )
          .subscribe({
            next: (res: any) => {
              this.voicesList = res.data.voice_details;
              // this.tableData = [res.data];
            },
            error: (error) => {
              // console.error('Email failed:', error);
            }
          });
        }

    onSubmit(){
        if (this.formGroup) {
            console.log(this.formGroup.value);
        }
    }

    onBasicUploadAuto(event: any) {
      const file = event.files[0];
      const validExtensions = ['.mp3', '.wav', '.ogg'];
      const fileExt = file.name.split('.').pop().toLowerCase();
    
      if (!validExtensions.includes('.' + fileExt)) {
        alert('Only voice/audio files are allowed!');
        return;
      }
      this.formGroup.patchValue({
        file: file
      });
      // Proceed with upload...
    }

    playAudio() {
      this.audioPlayer.nativeElement.play();
    }
  
    pauseAudio() {
      this.audioPlayer.nativeElement.pause();
    }
  
    stopAudio() {
      this.audioPlayer.nativeElement.pause();
      this.audioPlayer.nativeElement.currentTime = 0;
    }

}
