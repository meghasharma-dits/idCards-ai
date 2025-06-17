import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'lineBreakAfterSubject'
})
export class LineBreakAfterSubjectPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return value;
    const modified = value.replace(/(subject:)/i, '<br>$1');
    return this.sanitizer.bypassSecurityTrustHtml(modified);
  }
}
