import { Component, ElementRef, ViewChild, OnInit,HostListener } from '@angular/core';
import { fromEvent, Observable, forkJoin, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient and HttpClientModule

@Component({
  selector: 'app-validated-multi-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // Add HttpClientModule
  template: `
    <div class="autocomplete-container">
      <div class="chips-container">
        <span *ngFor="let chip of selectedChips" class="chip">
          {{ chip }}
          <button class="remove-chip" (click)="removeChip(chip)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </span>
        <input type="text" [formControl]="searchControl" #searchInput class="autocomplete-input" placeholder="Search...">
      </div>
      <div *ngIf="searchControl.invalid && searchControl.touched" class="error-message">
        {{ getErrorMessage() }}
      </div>
      <ul *ngIf="searchResults && searchResults.length > 0" class="autocomplete-list">
        <li *ngFor="let result of searchResults" (click)="selectResult(result)" class="autocomplete-item">
          {{ result }}
        </li>
      </ul>
    </div>
  `,
  styles: `
    .autocomplete-container {
      position: relative;
      width: 400px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .chips-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 8px;
      background-color: #f9f9f9;
    }

    .chip {
      background-color: #e8f0fe;
      color: #1e88e5;
      padding: 6px 10px;
      border-radius: 16px;
      margin: 4px;
      display: inline-flex;
      align-items: center;
      font-size: 14px;
      border: 1px solid #bbd2f7;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .chip:hover {
      background-color: #d1e5ff;
      transform: scale(1.05);
    }

    .remove-chip {
      background: none;
      border: none;
      cursor: pointer;
      margin-left: 8px;
      padding: 0;
      display: flex;
      align-items: center;
      color: #1e88e5;
      transition: color 0.3s ease;
    }

    .remove-chip svg {
      width: 14px;
      height: 14px;
    }

    .remove-chip:hover {
      color: #1565c0;
    }

    .autocomplete-input {
      flex-grow: 1;
      border: none;
      outline: none;
      font-size: 16px;
      padding: 8px;
      background-color: transparent;
    }

    .error-message {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 5px;
    }

    .autocomplete-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 0 4px 4px;
      max-height: 200px;
      overflow-y: auto;
      position: absolute;
      width: 100%;
      background-color: white;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .autocomplete-item {
      padding: 12px 20px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.2s ease;
    }

    .autocomplete-item:hover {
      background-color: #f0f0f0;
    }
  `
})
export class GAutocompleteComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: any;
  searchResults: string[] = [];
  searchControl = new FormControl('', Validators.required);
  selectedChips: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setupAutocomplete();
  }

  setupAutocomplete() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.performMultiSearch(searchTerm))
      )
      .subscribe((results) => {
        this.searchResults = results;
      });
  }

  performMultiSearch(searchTerm: string): Observable<string[]> {
    if (!searchTerm) {
      return of([]);
    }

    const requests = [
      this.searchFromWeb(searchTerm).pipe(catchError(() => of([]))),
      this.searchFromStatic(searchTerm).pipe(catchError(() => of([]))),
      this.searchFromAnotherWeb(searchTerm).pipe(catchError(() => of([])))
    ];

    return forkJoin(requests).pipe(
      map((results) => {
        const combinedResults = results.reduce((acc, current:any) => acc.concat(current), []);
        return Array.from(new Set(combinedResults));
      })
    );
  }

  searchFromWeb(searchTerm: string): Observable<string[]> {
    const url = `https://api.example.com/search?q=${searchTerm}`;
    return this.http.get<string[]>(url);
  }

  searchFromStatic(searchTerm: string): Observable<string[]> {
    const staticData = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    const results = staticData.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    return of(results);
  }

  searchFromAnotherWeb(searchTerm: string): Observable<string[]> {
    const url = `https://another-api.example.com/search?query=${searchTerm}`;
    return this.http.get<string[]>(url);
  }

  selectResult(result: string) {
    if (!this.selectedChips.includes(result)) {
      this.selectedChips.push(result);
    }
    this.searchControl.reset();
    this.searchResults = [];
    this.searchInput.nativeElement.focus();
  }

  removeChip(chip: string) {
    this.selectedChips = this.selectedChips.filter(c => c !== chip);
  }

  getErrorMessage() {
    if (this.searchControl.hasError('required')) {
      return 'Please enter a search term.';
    }
    return '';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' && this.selectedChips.length > 0) {
      this.selectedChips.pop();
    }
  }
}