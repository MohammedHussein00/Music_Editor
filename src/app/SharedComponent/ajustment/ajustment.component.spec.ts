import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustmentComponent } from './ajustment.component';

describe('AjustmentComponent', () => {
  let component: AjustmentComponent;
  let fixture: ComponentFixture<AjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
