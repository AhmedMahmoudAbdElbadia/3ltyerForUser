import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PharmacyorderPage } from './pharmacyorder.page';

describe('PharmacyorderPage', () => {
  let component: PharmacyorderPage;
  let fixture: ComponentFixture<PharmacyorderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyorderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
