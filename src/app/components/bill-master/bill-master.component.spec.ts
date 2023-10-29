import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillMasterComponent } from './bill-master.component';

describe('BillMasterComponent', () => {
  let component: BillMasterComponent;
  let fixture: ComponentFixture<BillMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
