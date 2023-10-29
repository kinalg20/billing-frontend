import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseListingComponent } from './purchase-listing.component';

describe('PurchaseListingComponent', () => {
  let component: PurchaseListingComponent;
  let fixture: ComponentFixture<PurchaseListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
