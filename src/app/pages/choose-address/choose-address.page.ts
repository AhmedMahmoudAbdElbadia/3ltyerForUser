import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-choose-address',
  templateUrl: './choose-address.page.html',
  styleUrls: ['./choose-address.page.scss'],
})
export class ChooseAddressPage implements OnInit {
  id: any;
  myaddress: any[] = [];
  from: any;
  selectedAddress: any;
  dummy = Array(10);
  catid: any;
  drugname: any;
  mobile: any;
  presimage: any;
  deliveryAddress: any;
  venueFCM: any;
  restId: any;
  constructor(
    private router: Router,
    private api: ApisService,
    private util: UtilService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private popoverController: PopoverController
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.from) {
        this.from = data.from;
      
      }
       else if (data.catid==403011321){
        this.catid=data.catid
        this.drugname= data.drugname
         this.mobile=data.mobile,
         this.presimage=data.presimage,
         this.restId=data.restId,
           console.log(this.mobile,"Catid")
      
       }
    });
  }

  getAddress() {
    this.api.getMyAddress(this.id).then((data) => {
      console.log('my address', data);
      this.dummy = [];
      if (data && data.length) {
        this.myaddress = data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
    }).catch(error => {
      console.log(error);
      this.dummy = [];
    });
  }

  ionViewWillEnter() {
    this.api.checkAuth().then((data: any) => {
      console.log(data);
      if (data) {
        this.id = localStorage.getItem("uid2");
        this.getAddress();
      }
    });
  }

  addNew() {
    this.router.navigate(['add-new-address']);
  }

  selectAddress() {
    if (this.from === 'cart') {
      const selecte = this.myaddress.filter(x => x.id === this.selectedAddress);
      const item = selecte[0];
      console.log('item', item);
      const address = {
        address: item.house + ' ' + item.landmark + ' ' + item.address,
        lat: item.lat,
        lng: item.lng,
        id: item.id
      };
      localStorage.setItem('deliveryAddress', JSON.stringify(address));
      // this.util.showToast('Address changed', 'success', 'bottom');
      // this.navCtrl.back();

      this.router.navigate(['payments']);
    }
    else if (this.catid==403011321){
      const selecte = this.myaddress.filter(x => x.id === this.selectedAddress);
      const item = selecte[0];
      console.log('item', item);
      const address = {
        address: item.house + ' ' + item.landmark + ' ' + item.address,
        lat: item.lat,
        lng: item.lng,
        id: item.id
      };
     

      
      localStorage.setItem('deliveryAddress', JSON.stringify(address));
 
              this.deliveryAddress= JSON.parse(localStorage.getItem('deliveryAddress'))
       this.util.show('creating order');
          this.api.checkAuth().then(async (data: any) => {
            console.log(data);
            if (data) {
          
              this.id=localStorage.getItem("uid2")
              // not from saved address then create new and save
              if (!this.deliveryAddress.id || this.deliveryAddress.id === '') {
                const addressId = this.util.makeid(10);
                const newAddress = {
                  id: addressId,
                  uid:  data.uid,
                  address: this.deliveryAddress.address,
                  lat: this.deliveryAddress.lat,
                  lng: this.deliveryAddress.lng,
                  title: 'home',
                  house: '',
                  landmark: ''
                };
                await this.api.addNewAddress(data.uid, addressId, newAddress).then((data) => {
                  this.deliveryAddress.id = addressId;
                }, error => {
                  console.log(error);
                }).catch(error => {
                  console.log(error);
                });
              }
      
              
              let id = this.util.makeid(10);
              const uid =  localStorage.getItem("uid2");
              const lng = localStorage.getItem('language');
              const selectedCity = localStorage.getItem('selectedCity');
              await localStorage.clear();
              localStorage.setItem('uid2', localStorage.getItem("uid2"));
              localStorage.setItem('language', lng);
              localStorage.setItem('selectedCity', selectedCity);
              console.log("uid",uid);
              const param = {
                uid:  data.uid,
                userId:  data.uid,
                orderId: id,
                time: moment().format('llll'),
                address: this.deliveryAddress,
                price:0,
                drugname:  this.drugname,
                mobile:     this.mobile,
                presimage: this.presimage,
                restId:this.restId,
                status: 'created',
                
                // driverId: this.drivers[0].uid,
                // dId: this.drivers[0].uid,
                paid: 'cod',
               
              };
              console.log('sent', param);
              this.api.CreatPharmacyOrder(id, param).then(async (data) => {
                this.util.hide();
                if (this.venueFCM && this.venueFCM !== '') {
                  this.api.sendNotification(this.util.translate('New Order Received'),
                    this.util.translate('New Order'), this.venueFCM).subscribe((data) => {
                      console.log('send notifications', data);
                    }, error => {
                      console.log(error);
                    });
                }
                swal.fire({
                  title: this.util.translate('Success'),
                  text: this.util.translate('Your is created succesfully'),
                  icon: 'success',
                  backdrop: false,
                });
      
      
                this.navCtrl.navigateRoot(['tabs/tab2']);
                console.log(data);
              }, error => {
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
                this.router.navigate(['tabs']);
              }).catch(error => {
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
                this.router.navigate(['tabs']);
                console.log(error);
              });
            } else {
              this.util.hide();
              this.util.errorToast(this.util.translate('Session expired'));
              this.router.navigate(['login']);
            }
      
          }, error => {
            this.util.hide();
            this.util.errorToast(this.util.translate('Session expired'));
            this.router.navigate(['login']);
          }).catch(error => {
            this.util.hide();
            this.util.errorToast(this.util.translate('Session expired'));
            this.router.navigate(['login']);
            console.log(error);
          });
      // }
      
    }
  }

  async openMenu(item, events) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: events,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        if (data.data === 'edit') {
          const navData: NavigationExtras = {
            queryParams: {
              from: 'edit',
              data: JSON.stringify(item)
            }
          };
          this.router.navigate(['add-new-address'], navData);
        } else if (data.data === 'delete') {
          console.log(item);
          swal.fire({
            title: this.util.translate('Are you sure?'),
            text: this.util.translate('to delete this address'),
            icon: 'question',
            confirmButtonText: this.util.translate('Yes'),
            backdrop: false,
            background: 'white',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: this.util.translate('cancel')
          }).then(data => {
            console.log(data);
            if (data && data.value) {
              this.util.show();
              this.api.deleteAddress(localStorage.getItem('uid2'), item.id).then(data => {
                console.log(data);
                this.util.hide();
                this.getAddress();
              }).catch(error => {
                console.log(error);
                this.util.hide();
              });
            }
          });

        }
      }
    });
    await popover.present();
  }
}
