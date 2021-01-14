import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PharmacyorderdetailsPage } from './pharmacyorderdetails.page';

describe('PharmacyorderdetailsPage', () => {
  let component: PharmacyorderdetailsPage;
  let fixture: ComponentFixture<PharmacyorderdetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyorderdetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyorderdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
