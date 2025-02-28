import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromiseSignalRxjsComponent } from './promise-signal-rxjs.component';

describe('PromiseSignalRxjsComponent', () => {
  let component: PromiseSignalRxjsComponent;
  let fixture: ComponentFixture<PromiseSignalRxjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromiseSignalRxjsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromiseSignalRxjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
