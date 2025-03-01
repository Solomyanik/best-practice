import { Component } from '@angular/core';

@Component({
  selector: 'app-promise-signal-rxjs',
  imports: [],
  templateUrl: './promise-signal-rxjs.component.html',
  styleUrl: './promise-signal-rxjs.component.css'
})
export class PromiseSignalRxjsComponent {
  
  constructor(){
    this.sequentialPromises();
    this.parallelPromises();
    this.chainAsync();
  }

  public mycode:any='see'
  
  async sequentialPromises() {
    try {
      console.log("Starting sequential promises...");
  
      const result1 = await new Promise((resolve) => setTimeout(() => resolve("Result 1"), 1000));
      console.log(result1);
  
      const result2 = await new Promise((resolve) => setTimeout(() => resolve("Result 2"), 500));
      console.log(result2);
  
      const result3 = await new Promise((resolve) => setTimeout(() => resolve("Result 3"), 2000));
      console.log(result3);
  
      console.log("Sequential promises completed.");
    } catch (error) {
      console.error("Error in sequential promises:", error);
    }
  }

  async parallelPromises() {
    try {
      console.log("Starting parallel promises...");
  
      const promise1 = new Promise((resolve) => setTimeout(() => resolve("Promise 1"), 1000));
      const promise2 = new Promise((resolve) => setTimeout(() => resolve("Promise 2"), 500));
      const promise3 = new Promise((resolve) => setTimeout(() => resolve("Promise 3"), 2000));
  
      const results = await Promise.all([promise1, promise2, promise3]);
      console.log("Parallel results:", results);
  
      console.log("Parallel promises completed.");
    } catch (error) {
      console.error("Error in parallel promises:", error);
    }
  }
  
  // Example 5: Chaining async functions
async  firstAsync(): Promise<string> 
{
  return new Promise((resolve) => setTimeout(() => resolve("Result 2a"), 500)) 
  //return "First result";
}

async secondAsync(input: string): Promise<string> {
  return `Second result from ${input}`;
}

async  chainAsync() {
  try {
    const firstResult = await this.firstAsync();
    const secondResult = await this.secondAsync(firstResult);
    console.log(secondResult);
  } catch (error) {
    console.error("Error in chained async:", error);
  }
}
}
