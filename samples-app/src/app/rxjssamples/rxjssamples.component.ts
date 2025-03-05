import { JsonPipe, } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { interval,switchMap,take,from,Subscription, combineLatest, fromEvent, map, filter, debounceTime, catchError, of, retry, timer} from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-rxjssamples',
  imports: [JsonPipe],
  templateUrl: './rxjssamples.component.html',
  styleUrl: './rxjssamples.component.css'
})

export class RxjssamplesComponent implements OnInit, OnDestroy {
  userDataResult: any;
  serverStatusResult: string = '';
  welcomeMessageResult: string = '';
  postsResult: any;
  mouseCoordsResult: string = '';
  searchResult: any;
  squaredEvenResult: string = '';
  fullNameResult: string = '';
  cancelSearchResult: any;
  errorResult: any;
  retryResult: any;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // interval: Server Status Polling
    const intervalSub = interval(2000).pipe(
      switchMap(() => fetch('https://jsonplaceholder.typicode.com/todos/1').then(res => res.status)),
      take(5)
    ).subscribe(status => {
      this.serverStatusResult += status + ', ';
    });
    this.subscriptions.push(intervalSub);

    // timer: Welcome Message
    const timerSub = timer(3000).subscribe(() => {
      this.welcomeMessageResult = 'Welcome!';
    });
    this.subscriptions.push(timerSub);

    // fromEvent: Mouse Coordinates
    const mouseSub = fromEvent(document, 'mousemove').subscribe(event => {
      this.mouseCoordsResult = `X: ${(event as MouseEvent).clientX }, Y: ${(event as MouseEvent).clientY}`;
    });
    this.subscriptions.push(mouseSub);

    // map + filter: Squared Even Numbers
    const mapFilterSub = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).pipe(
      map(n => n * n),
      filter(n => n % 2 === 0)
    ).subscribe(n => {
      this.squaredEvenResult += n + ', ';
    });
    this.subscriptions.push(mapFilterSub);

    // combineLatest: Full Name
    const firstNameInput = document.querySelector<HTMLInputElement>('#firstName');
    const lastNameInput = document.querySelector<HTMLInputElement>('#lastName');

    if (firstNameInput && lastNameInput) {
      const combineSub = combineLatest([
        fromEvent(firstNameInput, 'input').pipe(map((event: any) => event.target.value)),
        fromEvent(lastNameInput, 'input').pipe(map((event: any) => event.target.value))
      ]).pipe(
        map(([firstName, lastName]) => `${firstName} ${lastName}`)
      ).subscribe(fullName => {
        this.fullNameResult = fullName;
      });
      this.subscriptions.push(combineSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchUserData(): void {
    const fetchUserData = (userId: number) => {
      return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(response => response.json());
    };

    from(fetchUserData(1)).subscribe(user => {
      this.userDataResult = user;
    });
  }

  fetchPosts(): void {
    ajax.getJSON('https://jsonplaceholder.typicode.com/posts').subscribe((posts:any) => {
      this.postsResult = posts.slice(0, 5);
    });
  }

  search(query: string): void {
    fromEvent(document.querySelector('#searchInput') as Element, 'input').pipe(
      map(() => query),
      debounceTime(500),
      switchMap(q => ajax.getJSON(`https://jsonplaceholder.typicode.com/posts?title_like=${q}`)),
      catchError(() => of([]))
    ).subscribe((results:any) => {
      this.searchResult = results.slice(0, 5);
    });
  }

  cancelSearch(query: string): void {
    fromEvent((document.querySelector('#cancelSearchInput') as Element), 'input').pipe(
      map(() => query),
      debounceTime(300),
      switchMap(q => ajax.getJSON(`https://jsonplaceholder.typicode.com/posts?title_like=${q}`)),
      catchError(() => of([]))
    ).subscribe((results:any) => {
      this.cancelSearchResult = results.slice(0, 5);
    });
  }

  fetchError(): void {
    from(fetch('https://jsonplaceholder.typicode.com/nonexistent')).pipe(
      switchMap(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return from(response.json());
      }),
      catchError(() => of({ error: 'Failed to fetch data' }))
    ).subscribe(result => {
      this.errorResult = result;
    });
  }

  retryCall(): void {
    ajax.getJSON('https://jsonplaceholder.typicode.com/maybeFails').pipe(
      retry(3),
      catchError(() => of({ error: 'failed after 3 retries' }))
    ).subscribe(data => {
      this.retryResult = data;
    });
  }
}