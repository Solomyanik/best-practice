import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SubjectManagerServiceService implements OnDestroy {
  private eventSubject = new Subject<string>();
  private dataSubject = new Subject<number>();
  private userSubject = new Subject<{ id: number; name: string }>();

  getEventSubject(): Subject<string> {
    return this.eventSubject;
  }

  getDataSubject(): Subject<number> {
    return this.dataSubject;
  }

  getUserSubject(): Subject<{ id: number; name: string }> {
    return this.userSubject;
  }

  ngOnDestroy(): void {
    this.eventSubject.complete();
    this.dataSubject.complete();
    this.userSubject.complete();
  }
}