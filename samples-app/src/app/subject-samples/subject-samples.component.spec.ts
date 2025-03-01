import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSamplesComponent } from './subject-samples.component';

describe('SubjectSamplesComponent', () => {
  let component: SubjectSamplesComponent;
  let fixture: ComponentFixture<SubjectSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectSamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
