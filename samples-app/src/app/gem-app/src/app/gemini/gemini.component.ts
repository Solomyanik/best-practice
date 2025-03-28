// gemini.component.ts (Angular 19)

import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-gemini',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  template: `<div>
  <h2>Gemini API Integration</h2>
  <textarea [(ngModel)]="prompt" placeholder="Enter your prompt" autocomplete="on"></textarea>
  <div class="params-container">
    <label for="temperature">Temperature:</label>
    <input type="number" id="temperature" [(ngModel)]="temperature" min="0" max="1" step="0.01">
    <label for="topP">Top P:</label>
    <input type="number" id="topP" [(ngModel)]="topP" min="0" max="1" step="0.01">
    <label for="topK">Top K:</label>
    <input type="number" id="topK" [(ngModel)]="topK" min="1" step="1">
    <label for="maxOutputTokens">Max Output Tokens:</label>
    <input type="number" id="maxOutputTokens" [(ngModel)]="maxOutputTokens" min="1" step="1">
  </div>
  <button (click)="generateResponse()" class="generate-button">Generate Response</button>
  <div *ngIf="safeHtmlResponse">
    <h3>Response:</h3>
    <div [innerHTML]="safeHtmlResponse"></div>
  </div>
  <div *ngIf="error">
    <h3>Error:</h3>
    <pre>{{ error }}</pre>
  </div>
  <div *ngIf="loading">
    <h3>Loading...</h3>
  </div>
</div>
`,
styles: [`
textarea {
  width: 80%;
  height: 150px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 16px;
}

.params-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

label {
  margin: 5px 0;
}

input[type=number] {
  width: 80px; /* Adjust width as needed */
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

input[type=number]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.generate-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 8px;
}

.generate-button:hover {
  background-color: #3e8e41;
}

.generate-button:active {
  background-color: #2e7e31;
}
`],
})
export class GeminiComponent implements OnInit {
  prompt: string = '';
  response: any;
  safeHtmlResponse: SafeHtml | null = null;
  error: string | null = null;
  loading: boolean = false;
  apiKey: string = 'AIzaSyBjY_TDpvqARVFXlkbFdFYi2snOUVgw71o'; // Replace with your actual API key.
  apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';
  temperature: number = 0.9;
  topP: number = 1;
  topK: number = 1;
  maxOutputTokens: number = 2048;

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {}

  generateResponse(): void {
    this.loading = true;
    this.response = null;
    this.safeHtmlResponse = null;
    this.error = null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: this.prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: this.temperature,
        topP: this.topP,
        topK: this.topK,
        maxOutputTokens: this.maxOutputTokens,
      },
    };

    this.http.post(this.apiUrl + this.apiKey, requestBody, { headers }).subscribe({
      next: (data: any) => {
        this.loading = false;
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
          this.response = data.candidates[0].content.parts[0].text;
          this.safeHtmlResponse = this.sanitizer.bypassSecurityTrustHtml(this.response);
        } else {
          this.error = 'Unexpected API response format.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'An error occurred.';
      },
    });
  }
}