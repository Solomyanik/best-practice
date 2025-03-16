import { ChangeDetectionStrategy, Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-svg-toggle-button',
  imports: [CommonModule],
  template: `
     <button class="toggle-button" (click)="toggle()">
      <span class="icon-container" [ngClass]="{ 'active': isOn }">
        <svg *ngIf="isOn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon check">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <svg *ngIf="!isOn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon cross">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </span>
    </button>
  `,
  styles: [`
     .toggle-button {
      background: #f0f0f0;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      padding: 10px 20px;
      transition: background 0.3s ease;
      display: flex;
      align-items: center;
    }

    .toggle-button:hover {
      background: #e0e0e0;
    }

    .icon-container {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.3s ease;
    }

    .icon-container.active {
      transform: rotate(360deg);
    }

    .svg-icon {
      width: 30px;
      height: 30px;
      position: absolute;
      transition: opacity 0.3s ease, fill 0.3s ease;
    }

    .check {
      fill: #4CAF50; /* Green check */
      opacity: 1;
    }

    .cross {
      fill: #f44336; /* Red cross */
      opacity: 0;
    }

    .icon-container.active .check {
      opacity: 1;
    }

    .icon-container.active .cross {
      opacity: 0;
    }

    .icon-container:not(.active) .check {
      opacity: 0;
    }

    .icon-container:not(.active) .cross {
      opacity: 1;
    }
  `]
})

export class GButtonComponent {
  isOn = false;

  toggle() {
    this.isOn = !this.isOn;
  }
}
