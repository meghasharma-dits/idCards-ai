import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './core/services/spinner.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'invoice-ai';
  isLoading = false;
  private loadingTimeout: ReturnType<typeof setTimeout> | null = null;
  private spinnerSubscription: Subscription | null = null;
  constructor(private spinnerService: SpinnerService) {

    this.spinnerSubscription = this.spinnerService.spinner$.subscribe((loading) => {
      // Clear any pending timeout
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }
  
      if (loading) {
        // Only show loading indicator after 500ms delay
        this.loadingTimeout = setTimeout(() => {
          this.isLoading = true;
        }, 500);
      } else {
        // Hide immediately when loading is complete
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    // Clean up both the timeout and subscription
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    if (this.spinnerSubscription) {
      this.spinnerSubscription.unsubscribe();
    }
  }
}
//this is testing text
