import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDataComponent } from './current-data.component';

describe('CurrentDataComponent', () => {
  let component: CurrentDataComponent;
  let fixture: ComponentFixture<CurrentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
