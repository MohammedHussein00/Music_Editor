import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortDataComponent } from './sort-data.component';

describe('SortDataComponent', () => {
  let component: SortDataComponent;
  let fixture: ComponentFixture<SortDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
