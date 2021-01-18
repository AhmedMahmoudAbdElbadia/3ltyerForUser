import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import * as moment from 'moment';
import { ApisService } from '../services/apis.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-pharmacyorder',
  templateUrl: './pharmacyorder.page.html',
  styleUrls: ['./pharmacyorder.page.scss'],
})
export class PharmacyorderPage implements OnInit {
  haveItems: boolean = false;
  myOrders: any[] = [];
  dummy = Array(50);
  vid: any;
  name: any;
  cover: any;
  address: any;
  vdata: any;
  PharmacyOrders: any;
  constructor(
    private api: ApisService,
    private util: UtilService,
    private router: Router,
    private adb: AngularFirestore
  ) {
    if (localStorage.getItem('uid2')) {
     

      this.adb.collection('orderpharmacy', ref => ref.where('userId', '==', localStorage.getItem('uid2'))).snapshotChanges().subscribe(data => {
        if (data) {
          console.log(data,"Dataa")
          this.getPharmacyOrders();
          
        }

        
      });
    }
    this.util.subscribeLoggedIn().subscribe(data => {
      
      this.getPharmacyOrders();
    });
  }


  ngOnInit() {
  }
  async ionViewWillEnter() {
    await this.validate();
  }
  getCart() {
    const navData: NavigationExtras = {
      queryParams: {
        id: "403011321",
        flag:false
      }
     };
    this.router.navigate(['home'],navData);
  }
  validate() {
    this.api.checkAuth().then(async (user: any) => {
      if (user) {
    localStorage.setItem('uid2', user.uid);
        this.getPharmacyOrders();
      } else {
        this.router.navigate(['login']);
      }
    }).catch(error => {
      console.log(error);
    });
  }
  getPharmacyOrders() {
    this.api.getPharmacyOrders(localStorage.getItem('uid2')).then((data: any) => {
      console.log('my orders', data);
      if (data && data.length) {
        this.haveItems = true;
        // data.forEach(element => {
        //   element.time = new Date(element.time);
        //  this.vid= element.vid
        
        // });
        data.sort((a, b) => b.time - a.time);
        this.PharmacyOrders = data;
        // this.PharmacyOrders.forEach(element => {
        //   element.order = JSON.parse(element.order);
        // });
        console.log('PharmacyOrders==>', this.PharmacyOrders);
      }
      this.dummy = [];
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }
  goToHistoryDetail(orderId) {
    const navData: NavigationExtras = {
      queryParams: {
        id: orderId
      }
    };
    this.router.navigate(['/pharmacyorderdetails'], navData);
  }
  getDate(date) {
    return moment(date).format('llll');
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
