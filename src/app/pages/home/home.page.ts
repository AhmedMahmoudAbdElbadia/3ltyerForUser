import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { Platform, ModalController, NavController, ActionSheetController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { orderBy, uniqBy } from 'lodash';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { OrderPharmacy } from 'src/app/interfaces/OrderPharmacy';
import swal from 'sweetalert2';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { CallNumber } from '@ionic-native/call-number/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
 pharmacy: OrderPharmacy = { address: '', drugname: '', PhoneNum: '', presimage: '' };

  categoryId: any;
  plt;
  allRest: any[] = [];
  headerHidden: boolean;
  chips: any[] = [];
  showFilter: boolean;
  lat: any;
  lng: any;
  // address: any;
  dummyRest: any[] = [];
  dummy = Array(50);
  haveLocation: boolean;
  nearme: boolean = false;
  profile: any;
  banners: any[] = [];
  slideOpts = {
    slidesPerView: 1.7,
  };
  cityName: any;
  cityId: any;
  MarketFlage: any;
  flagPharmcy: any;
  myaddress: any;
  id: any;
  PharmChooseAddress: boolean;
  AddressPage: boolean;
  deliveryAddress: any;
  vid: any;
  presimage: any;
  coverImage: any='';
  image: any = '';
  constructor(
    private actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic,
    public geolocation: Geolocation,
    private router: Router,
    private api: ApisService,
    private util: UtilService,
    private apis: ApisService,
    public modalController: ModalController,
    private navCtrl: NavController,
    private camera: Camera,
    private callNumber: CallNumber
  ) {
    
    const currentLng = this.util.getLanguage();
    console.log('current language --->', currentLng);
  //  this.chips = [this.util.translate('Ratting 4.0+'), this.util.translate('Fastest Delivery'), this.util.translate('Cost')];
    // ['Ratting 4.0+', 'Fastest Delivery', 'Cost'];
    this.haveLocation = false;
    if (this.platform.is('ios')) {
      this.plt = 'ios';
    } else {
      this.plt = 'android';
    }
    this.api.getBanners().then(data => {
      console.log(data);
      this.banners = data;
    }).catch(error => {
      console.log(error);
    });
    const city = JSON.parse(localStorage.getItem('selectedCity'));
    console.log(city);
    if (city && city.name) {
      this.cityName = city.name;
      this.cityId = city.id;

      this.route.queryParams.subscribe(data => {
        console.log('data=>', data);
        if (data.hasOwnProperty('id')) {
          this.categoryId = data.id;
          this.MarketFlage=data.flag
          console.log("Home Market Flag",this.MarketFlage)
          console.log("Home Catid Flag",this.categoryId)
          if(this.categoryId=="159132186"){
            this.MarketFlage=true;
            this.flagPharmcy=false;
           // this.flagPharmcy=false
            this.getSection();
            console.log("Section Here")
          }
          else if (this.categoryId=="403011321"){
                     this.flagPharmcy=true
                    // this.getSection();
                    this.getRest();
          }
          else{ 
            this.flagPharmcy=false;
            this.MarketFlage=false;
            this.getRest();
           
          }
         
        }
      });

      
    }
  }

  addFilter(index) {
    console.log(index);
    if (index === 0) {
      console.log('rating');
      this.allRest = orderBy(this.allRest, 'ratting', 'desc');
    } else if (index === 1) {
      console.log('fast');
      this.allRest = orderBy(this.allRest, 'time', 'asc');
    } else {
      console.log('cost');
      this.allRest = orderBy(this.allRest, 'dishPrice', 'asc');
    }
    this.allRest = uniqBy(this.allRest, 'id');
  }
// CreatPharmacyOrder(form: NgForm){
//   this.api.checkAuth().then(async (data: any) => {
//     console.log(data);
//     if (data) {
  
//       this.id=localStorage.getItem("uid2")
      
//       if (!this.deliveryAddress.id || this.deliveryAddress.id === '') {
//         const addressId = this.util.makeid(10);
//         const newAddress = {
//           id: addressId,
//           uid:  data.uid,
//           address: this.deliveryAddress.address,
//           lat: this.deliveryAddress.lat,
//           lng: this.deliveryAddress.lng,
//           title: 'home',
//           house: '',
//           landmark: ''
//         };
//         await this.api.addNewAddress(data.uid, addressId, newAddress).then((data) => {
//           this.deliveryAddress.id = addressId;
//         }, error => {
//           console.log(error);
//         }).catch(error => {
//           console.log(error);
//         });
//       }


//       let id = this.util.makeid(10);
//      ;
//       const uid =  localStorage.getItem("uid2");
//       const lng = localStorage.getItem('language');
//       const selectedCity = localStorage.getItem('selectedCity');
//       await localStorage.clear();
//       localStorage.setItem('uid2', localStorage.getItem("uid2"));
//       localStorage.setItem('language', lng);
//       localStorage.setItem('selectedCity', selectedCity);
  
//       console.log("uid",uid);
//       const param = {
//         uid:  data.uid,
//         userId:  data.uid,
//         orderId: id,
//         presimage:this.presimage,
//         time: moment().format('llll'),
//         address: this.deliveryAddress,
//         status: 'created',
      
//       };
//       console.log('sent', param);
//       this.api.CreatPharmacyOrder(id, param).then(async (data) => {
//         this.util.hide();
      
//         swal.fire({
//           title: this.util.translate('Success'),
//           text: this.util.translate('Your is created succesfully'),
//           icon: 'success',
//           backdrop: false,
//         });


//         this.navCtrl.navigateRoot(['tabs/tab2']);
//         console.log(data);
//       }, error => {
//         this.util.hide();
//         this.util.errorToast(this.util.translate('Something went wrong'));
//         this.router.navigate(['tabs']);
//       }).catch(error => {
//         this.util.hide();
//         this.util.errorToast(this.util.translate('Something went wrong'));
//         this.router.navigate(['tabs']);
//         console.log(error);
//       });
//     } else {
//       this.util.hide();
//       this.util.errorToast(this.util.translate('Session expired'));
//       this.router.navigate(['login']);
//     }

//   }, error => {
//     this.util.hide();
//     this.util.errorToast(this.util.translate('Session expired'));
//     this.router.navigate(['login']);
//   }).catch(error => {
//     this.util.hide();
//     this.util.errorToast(this.util.translate('Session expired'));
//     this.router.navigate(['login']);
//     console.log(error);
//   });
// // }
// }
  ionViewWillEnter() {
    this.api.checkAuth().then((data: any) => {
      console.log(data);
      if (data) {
        this.id = localStorage.getItem("uid2");
        this.getAddress();
      }
    });
    this.getLocation();
    this.getProfile();
//this.AddressPage=false
  }

  opemCamera(type) {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 700,
      targetWidth: 700,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: type === 'camera' ? 1 : 0
    };
    console.log('open');
    this.camera.getPicture(options).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.image = base64Image;
      this.util.show();
      const id = localStorage.getItem('uid') + '/' + this.util.makeid(10);
      firebase.storage().ref().child(localStorage.getItem('uid')).child(btoa(id) + '.jpg')
        .putString(base64Image, 'data_url').then((snapshot) => {
          this.util.hide();
          snapshot.ref.getDownloadURL().then((url) => {
            console.log('url uploaded', url);
            this.coverImage = url;
          });
        }, error => {
          this.util.hide();
          console.log(error);
          this.util.errorToast(this.util.translate('Something went wrong'));
        }).catch((error) => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
    }, (err) => {
      this.util.hide();
    });
  }

  async cover() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [{
        text: this.util.translate('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('Delete clicked');
          this.opemCamera('camera');
        }
      }, {
        text: this.util.translate('Gallery'),
        icon: 'image',
        handler: () => {
          console.log('Share clicked');
          this.opemCamera('gallery');
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  call(){
    this.callNumber.callNumber("01120875769", true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }
  ChooseAddress(){
   //this.flagPharmcy=false;
    // this.PharmChooseAddress=true
    // this.AddressPage=true
    // console.log("Choessadrr",this.PharmChooseAddress,this.AddressPage)
    if(this.pharmacy.PhoneNum==""||!this.pharmacy.PhoneNum){
      this.util.hide();
      this.util.showToast('يجب ادخال رقم الموبايل ', 'danger', 'bottom');
    }
    else{
    console.log(this.pharmacy.PhoneNum)
    const navData: NavigationExtras = {
      queryParams: {
      catid:  this.categoryId,
      drugname:this.pharmacy.drugname,
      mobile:this.pharmacy.PhoneNum,
      presimage:this.coverImage,
      restId:"d5dSClrdqhepWY9k5cXiMgnniF02"
      }
     };
     this.router.navigate(['choose-address'], navData);
    }
// localStorage.setItem('MarketFlage',String(this.flag));
  }
  // getAddressMy() {
  //   const add = JSON.parse(localStorage.getItem('deliveryAddress'));
  //   if (add && add.address) {
  //     this.address = add.address;
  //     this.lat = add.lat;
  //     this.lng = add.lng;
  //   }
  //   return this.address;
  // }

  getLocation() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
          result => console.log('Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        );
        this.grantRequest();
      } else if (this.platform.is('ios')) {
        this.grantRequest();
      } else {
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
          if (resp) {
            console.log('resp', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            // this.getAddress(this.lat, this.lng);
          }
        }).catch(error => {
          console.log(error);
          this.grantRequest();
        });
      }
    });
  }

  grantRequest() {
    this.diagnostic.isLocationEnabled().then((data) => {
      if (data) {
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
          if (resp) {
            console.log('resp', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            // this.getAddress(this.lat, this.lng);
          }
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.diagnostic.switchToLocationSettings();
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
          if (resp) {
            console.log('ress,', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            // this.getAddress(this.lat, this.lng);
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }, error => {
      console.log('errir', error);
      this.dummy = [];
    }).catch(error => {
      console.log('error', error);
      this.dummy = [];
    });

  }

  ngOnInit() {
   
  }

  // getAddress(lat, lng) {
  //   setTimeout(() => {
  //     this.haveLocation = true;
  //     const geocoder = new google.maps.Geocoder();
  //     const location = new google.maps.LatLng(lat, lng);
  //     geocoder.geocode({ 'location': location }, (results, status) => {
  //       console.log(results);
  //       console.log('status', status)
  //       if (results && results.length) {
  //         this.address = results[0].formatted_address;
  //         this.lat = lat;
  //         this.lng = lng;
  //         const address = {
  //           address: this.address,
  //           lat: this.lat,
  //           lng: this.lng,
  //           id: ''
  //         };
  //         localStorage.setItem('deliveryAddress', JSON.stringify(address));
  //       } else {
  //         this.dummy = [];
  //         this.util.errorToast('Something went wrong please try again later');
  //       }
  //     });
  //     localStorage.setItem('myLat', this.lat);
  //     localStorage.setItem('myLng', this.lng);
  //     this.getRest();
  //   }, 1000);
  // }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  getTime(time) {
    return moment(time).format('mm');
  }

  async presentModal() {
    //   const modal = await this.modalController.create({
    //     component: ChooseAddressPage
    //   });
    //   return await modal.present();
    await this.router.navigate(['choose-address']);
  }

  nearMe() {
    this.dummy = Array(50);
    this.allRest = [];
    if (this.nearme) {
      this.dummyRest.forEach(async (element) => {
        const distance = await this.distanceInKmBetweenEarthCoordinates(this.lat, this.lng, element.lat, element.lng);
        console.log('distance', distance);
        // Distance
        if (distance < 10) {
          this.allRest.push(element);
        }
      });
      this.dummy = [];
    } else {
      this.allRest = this.dummyRest;
      this.dummy = [];
    }
  }

  getRest() {
    this.dummy = Array(10);
    this.api.getVenues(this.categoryId).then(data => {
     
      if (data && data.length) {
        this.allRest = [];
        data.forEach(async (element) => {
          if (element && element.isClose === false && element.city === this.cityId) {
            console.log("element",element.id);
            this.allRest.push(element);
            this.dummyRest.push(element);
         
          }
        });   
       
        this.dummy = [];
      } else {
        this.allRest = [];
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.dummy = [];
    }).catch(error => {
      console.log(error);
      this.dummy = [];
    });
  }
  getSection() {
    this.dummy = Array(10);
    this.api.getSection().then(data => {
     
      if (data && data.length) {
        this.allRest = [];
        data.forEach(async (element) => {
          if (element  ) {
            console.log("element",element);
            this.allRest.push(element);
            this.dummyRest.push(element);
         
          }
        });   
       
        this.dummy = [];
      } else {
        this.allRest = [];
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.dummy = [];
    }).catch(error => {
      console.log(error);
      this.dummy = [];
    });
  }
  openMenu(item) {
  
    if (item && item.status === 'close') {
      return false;
    }
    const navData: NavigationExtras = {
    
      queryParams: {
        id: item.id,
        flag:this.MarketFlage

      }
      
      
    };
    console.log("IDT",item.id)
    this.router.navigate(['category'], navData);
  }

  openOffers(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.restId
      }
    };
    this.router.navigate(['category'], navData);
  }

  onSearchChange(event) {
    console.log(event.detail.value);

    this.allRest = this.dummyRest.filter((ele: any) => {
      return ele.name.toLowerCase().includes(event.detail.value.toLowerCase());
    });
  }

  getCusine(cusine) {
    return cusine.join('-');
  }

  onScroll(event) {
    if (event.detail.deltaY > 0 && this.headerHidden) return;
    if (event.detail.deltaY < 0 && !this.headerHidden) return;
    if (event.detail.deltaY > 80) {
      this.headerHidden = true;
    } else {
      this.headerHidden = false;
    }
  }

  getProfile() {
    if (localStorage.getItem('uid2')) {

      this.apis.getProfile(localStorage.getItem('uid2')).then((data) => {
        console.log(data);
        if (data && data.cover) {
          this.profile = data.cover;
        }
        if (data && data.status === 'deactive') {
          localStorage.removeItem('uid');
          this.api.logout().then(data => {
            console.log(data);
          });
          this.router.navigate(['login']);
          Swal.fire({
            title: 'Error',
            text: 'Your are blocked please contact administrator',
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Need Help?',
            backdrop: false,
            background: 'white'
          }).then(data => {
            if (data && data.value) {
              this.router.navigate(['inbox']);
            }
          });
        }
      }, err => {
        console.log('Err', err);
      }).catch(e => {
        console.log('Err', e);
      });
    }
  }

  chipChange(item) {
    this.allRest = this.dummyRest;
    console.log(item);
    if (item === 'Fastest Delivery') {
      this.allRest.sort((a, b) => {
        a = new Date(a.time);
        b = new Date(b.time);
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }

    if (item === 'Ratting 4.0+') {
      this.allRest = [];

      this.dummyRest.forEach(ele => {
        if (ele.ratting >= 4) {
          this.allRest.push(ele);
        }
      });
    }

    if (item === 'Cost') {
      this.allRest.sort((a, b) => {
        a = a.time;
        b = b.time;
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }

  }
  changeLocation() {
    this.navCtrl.navigateRoot(['cities']);
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
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
}
