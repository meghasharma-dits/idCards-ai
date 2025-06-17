import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-number-chips',
  imports: [ChipModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './number-chips.component.html',
  styleUrl: './number-chips.component.scss'
})
export class NumberChipsComponent {
  numberInput = new FormControl('');
  @Input() numberChips: number[] = [];
  maxChips = 4;

  addNumber() {
    const value = this.numberInput.value?.trim();
    
    if (value && !isNaN(Number(value))) {
      const numValue = Number(value);
      
      if (this.numberChips.length < this.maxChips && !this.numberChips.includes(numValue)) {
        this.numberChips.push(numValue);
        this.numberInput.reset();
      }
    }
  }

  removeChip(index: number) {
    this.numberChips.splice(index, 1);
    const spliceValues = this.numberChips;
    this.numberChips = [];
    setTimeout(() => { this.numberChips = spliceValues });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addNumber();
      event.preventDefault(); // Prevent form submission if inside a form
    }
    
    // Allow: numbers, backspace, delete, tab, escape, arrow keys
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    if (allowedKeys.includes(event.key)) return;
    
    // Prevent non-number input
    if (isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }
}
