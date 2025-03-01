import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SubjectManagerServiceService } from '../subject-samples/SubjectManagerService.service';

@Component({
  selector: 'app-subject-samples',
  imports: [],
  templateUrl: './subject-samples.component.html',
  styleUrl: './subject-samples.component.css'
})
export class SubjectSamplesComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  public result:any="--NA--"

  constructor(private subjectManager: SubjectManagerServiceService) {
    this.subjectManager
      .getEventSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message:any) => this.result='Event received:'+message);

    this.subjectManager
      .getDataSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any) => this.result='Event received:'+data);

    this.subjectManager
      .getUserSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user:any) => this.result='Event received:'+user);
  }

  emitEvent() {
    this.subjectManager.getEventSubject().next('Button clicked!');
  }

  emitData() {
    this.subjectManager.getDataSubject().next(Math.random());
  }

  emitUser() {
    this.subjectManager.getUserSubject().next({ id: 1, name: 'John Doe' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}