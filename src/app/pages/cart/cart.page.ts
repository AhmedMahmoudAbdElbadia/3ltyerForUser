import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { stringify } from '@angular/compiler/src/util';
interface OnEnter {
  onEnter(): Promise<void>;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnEnter, OnDestroy {
  private subscription: Subscription;
  haveItems = false;
  vid: any = '';
  foods: any;
  name: any;
  descritions: any;
  cover: any;
  address: any;
  time: any;
  totalPrice: any = 0;
  totalItem: any = 0;
  serviceTax: any = 0;
  deliveryCharge: any;
  grandTotal: any = 0;
  deliveryAddress: any = '';
  totalRatting: any = 0;
  coupon: any;
  dicount: any;
  venue: any;
  NotesCheck:boolean;

  cart: any[] = [];
  newqu: any;
  fid: any;
  cartemy: boolean;
  categoryId: any;
  dummy: any[];
  allRest: any[];
  dummyRest: any;
  dishPrice: any;
  
  constructor(
    private route: ActivatedRoute,
    private api: ApisService,
    private router: Router,
    private util: UtilService,
    private navCtrl: NavController,
    private chMod: ChangeDetectorRef,
    private platform: Platform
  ) {
    this.platform.backButton.subscribe( () => {
      this.router.navigate(['tabs/tab1']);
    });
    this.dishPrice=localStorage.getItem("dishPrice");
    // this.route.queryParams.subscribe(data => {
    //   console.log('data=>', data);
    //   if (data.hasOwnProperty('id')) {
    //     this.categoryId = data.id;
    //     this.getRest();
    //   }
    // });
    // this.api.getVenueDetails(this.vid).then(data => {
      
    //   this.venue = data;
    //   console.log("venue",this.venue)
    //   if (data) {
    //     this.name = data.name;
    //     this.descritions = data.descritions;
    //     this.cover = data.cover;
    //     this.address = data.address;
    //     this.time = data.time;
    //     this.totalRatting = data.totalRatting;
    //     this.deliveryCharge=data.dishPrice
    //     console.log("هنا هنا هنا هنا",this.deliveryCharge)
    //   }
    // }, error => {
    //   console.log(error);
    //   this.util.errorToast(this.util.translate('Something went wrong'));
    // }).catch(error => {
    //   console.log(error);
    //   this.util.errorToast(this.util.translate('Something went wrong'));
    // });
    this.util.getCouponObservable().subscribe(data => {
      if (data) {
        // console.log(data);
        this.coupon = data;
        // console.log('coupon', this.coupon);
        // console.log(this.totalPrice);
        localStorage.setItem('coupon', JSON.stringify(data));
        this.getVenueDetails();
        this.calculate();
      } else { 
        this.getVenueDetails();
        this.calculate();
      }


    });
    
  }

  public async ngOnInit(): Promise<void> {
   
    console.log("MarketFlage",localStorage.getItem("MarketFlage"))
    this.dishPrice=   localStorage.getItem("dishPrice");
    console.log("dishprice2020",this.dishPrice);
    await this.onEnter();
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/tabs/tab3') {
        this.onEnter();
        
      }
    });
    
  }
  getRest() {
    this.dummy = Array(10);
    this.api.getVenues(this.categoryId).then(data => {
      console.log(data);
      if (data && data.length) {
        this.allRest = [];
       
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
  public async onEnter(): Promise<void> {
    if(this.cart.length!=0){
      this.cartemy=false;
    }
    this.validate();
    this.dishPrice=localStorage.getItem("dishPrice");
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAddress() {
    const add = JSON.parse(localStorage.getItem('deliveryAddress'));
    if (add && add.address) {
      this.deliveryAddress = add.address;
    }
    return this.deliveryAddress;
  }

  getVenueDetails() {

    // Venue Details
    if(localStorage.getItem("MarketFlage")=="true"){
      this.api.getSectionDetails(localStorage.getItem("sectionid")).then(data => {
      
        this.venue = data;
        this.dishPrice=data.dishPrice
        console.log("venue2020",this.dishPrice)
        console.log("venue2020",this.venue)
        if (data) {
          this.name = data.name;
          this.descritions = data.descritions;
          this.cover = data.cover;
          this.address = data.address;
          this.time = data.time;
          this.totalRatting = data.totalRatting;
          this.dishPrice=data.dishPrice
        }
      }, error => {
        console.log(error);
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    }
    else{
      this.api.getVenueDetails(this.vid).then(data => {
      
        this.venue = data;
        this.dishPrice=data.dishPrice
        console.log("venue2020",this.dishPrice)
        console.log("venue2020",this.venue)
        if (data) {
          this.name = data.name;
          this.descritions = data.descritions;
          this.cover = data.cover;
          this.address = data.address;
          this.time = data.time;
          this.totalRatting = data.totalRatting;
          this.dishPrice=data.dishPrice
        }
      }, error => {
        console.log(error);
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    }
  
  }

  validate() {
    this.api.checkAuth().then(async (user) => {
      if (user) {
        const id = await localStorage.getItem('vid');
        if (id) {
          this.vid = id;
          this.getVenueDetails();
          // const foods = await localStorage.getItem('foods');
          // if (foods) {
          //   this.foods = await JSON.parse(foods);
          //   let recheck = await this.foods.filter(x => x.quantiy > 0);
          //   console.log('vid', this.vid);
          //   console.log('foods', this.foods);
          //   if (this.vid && this.foods && recheck.length > 0) {
          //     this.haveItems = true;
          //     this.calculate();
          //     this.chMod.detectChanges();
          //   }
          // }
          const cart = localStorage.getItem('userCart');
        
          try {
            
            if (cart && cart !== 'null' && cart !== undefined && cart !== 'undefined') {
              this.cartemy=false;
              this.cart = JSON.parse(localStorage.getItem('userCart'));
              this.cart.push(localStorage.getItem("dishPrice"));
             console.log(this.cart,"......Cart")
             
              this.calculate();
              
           

            } else {
              this.cart = [];
              this.cartemy=true;
            }
          } catch (error) {
            console.log(error);
            this.cart = [];
          }

          // console.log('========================>', this.cart);
        } else {
          this.haveItems = false;
          this.chMod.detectChanges();
        }
        this.chMod.detectChanges();
        return true;
      } else {
        this.router.navigate(['login']);
      }
    }).catch(error => {
      console.log(error);
    });

    
  }
  // AddFav(){
  //   localStorage.setItem('Fav',JSON.stringify(this.cart))
  // }
  getCart() {
    this.navCtrl.navigateRoot(['tabs/tab1']);
  }
  addQ(index,j2,j) {

    this.cart[index].selectedItem[j].item[j2].quantity  ++;
    this.cart[index].quantiy  ++;
    console.log( this.cart[index].selectedItem[j].item[j2].quantity+"الكميه بعد الاضافة ")
    
    this.calculate();
  }
  removeQ(index,j2,j) {
    if (this.cart[index].selectedItem[j].item[j2].quantity !== 0 ) {
      this.cart[index].selectedItem[j].item[j2].quantity  --;
      this.cart[index].quantiy  --;
      console.log( this.cart[index].selectedItem[j].item[j2].quantity+"الكميه بعد التنقيص ")
      this.calculate();
    } else if (this.cart[index].selectedItem[j].item[j2].quantity < 0) {
      this.cart[index].selectedItem[j].item[j2].quantity = 0;
    }
    localStorage.setItem('userCart', JSON.stringify(this.foods));
    this.calculate();
    
  }
ClearCart(){
this.cart=[];
this.cartemy=true;
  this.calculate();
}

  addQAddos(i,j2,j) {
    // console.log(this.cart[i].selectedItem[j]);
    // this.cart[i].selectedItem[j].total = this.cart[i].selectedItem[j].total + 1;
    // this.calculate();
    
   // var cartlength=this.cart[i].selectedItem[j].item.length;
// for(var jj:number=0; jj<cartlength; jj++)
// {
 // this.cart[i].selectedItem[j].item[j2].quantity++;

// }
// this.cart[i].selectedItem[j].total = this.cart[i].selectedItem[j].total + 1; 
// this.cart[i].item[j].quantiy = this.cart[i].item[j].quantiy + 1;

//  this.cart[i].selectedItem[j].item[j2].quantity  ++;

   
var cartlength=this.cart[i].selectedItem[j].item.length;
// for(var jj:number=0; jj<cartlength; jj++)
// {
//   this.cart[i].selectedItem[j].item[jj].quantity++;

// }
this.cart[i].selectedItem[j].total = this.cart[i].selectedItem[j].total + 1; 
    // console.log( this.cart[index].selectedItem[0].item[j].quantity+"الكميه بعد الاضافة ")
    
    this.calculate();
  }
  removeQAddos(i, j) {
    // console.log(this.cart[i].selectedItem[j]);
    if (this.cart[i].selectedItem[j].total !== 0) {
        
    var cartlength=this.cart[i].selectedItem[0].item.length;
    for(var jj:number=0; jj<cartlength; jj++)
    {
      this.cart[i].selectedItem[0].item[jj].quantity--;
    
    }
    this.cart[i].selectedItem[j].total = this.cart[i].selectedItem[j].total - 1; 
      if (this.cart[i].selectedItem[j].total === 0) {
        const newCart = [];
        this.cart[i].selectedItem.forEach(element => {
          if (element.total > 0) {
            newCart.push(element);
          }
        });
        // console.log('newCart', newCart);
        this.cart[i].selectedItem = newCart;
        this.cart[i].quantiy = newCart.length;
      }
    }
    this.calculate();
  }

  addItem() {

    if(localStorage.getItem("MarketFlage")=="true"){
      const navData: NavigationExtras = {
        queryParams: {
          id: "159132186",
          flag:"true"

        }
      };
      this.router.navigate(['home'], navData);
    }
    else{
      const navData: NavigationExtras = {
      queryParams: {
        id: this.venue.uid
      }
    };
    this.router.navigate(['category'], navData);
    }
  }



  /// NEW calc

  async calculate() {
    // new
    this.getVenueDetails();

    let item = this.cart.filter(x => x.quantiy > 0);
    this.cart.forEach(element => {
      if (element.quantiy === 0) {
        element.selectedItem = [];
      }
      
     
    });
    // console.log('item=====>>', item);
    this.totalPrice = 0;
    this.totalItem = 0;
    this.cart = [];
    // console.log('cart emplth', this.cart, item);
    item.forEach(element => {
      this.totalItem = this.totalItem + element.quantiy;
      console.log('itemsss----->>>', element.quantiy);
      if (element && element.selectedItem && element.selectedItem.length > 0) {
        let subPrice = 0;
        element.selectedItem.forEach(subItems => {
          subItems.item.forEach(realsItems => {
            subPrice = subPrice + (parseInt(realsItems.quantity) * realsItems.value);

            
          });
          
          // subPrice = subPrice * subItems.total;
        });
        this.totalPrice = this.totalPrice + subPrice;
      } else {
        element.selectedItem.forEach(subItems => {
          subItems.item.forEach(realsItems => {
            
this.totalPrice = this.totalPrice + (parseFloat(realsItems.value) * parseInt(realsItems.quantiy));
this.grandTotal=this.totalPrice;
let subPrice = 0;
subPrice = subPrice + (parseInt(realsItems.quantity) * realsItems.value);

          });
          
          //subPrice = subPrice * subItems.total;
        });
        
      }
      this.cart.push(element);
     
    });
    localStorage.removeItem('userCart');
    console.log('cart---->>>', this.cart);
    localStorage.setItem('userCart', JSON.stringify(this.cart));
    this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    // new

    // console.log('total item', this.totalItem);
    // console.log('=====>', this.totalPrice);
   // const tax = (parseFloat(this.totalPrice) * 21) / 100;
    //this.serviceTax = tax.toFixed(2);
    this.serviceTax=0;
    // console.log('tax->', this.serviceTax);
    //this.deliveryCharge = 5;
    console.log("قيمه التوصيل ف الكارت ", this.dishPrice)
    this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.dishPrice);
    this.grandTotal = this.grandTotal.toFixed(2);
    if (this.coupon && this.coupon.code && this.totalPrice >= this.coupon.min) {
      if (this.coupon.type === '%') {
        // console.log('per');
        function percentage(num, per) {
          return (num / 100) * per;
        }
        const totalPrice = percentage(parseFloat(this.totalPrice).toFixed(2), this.coupon.discout);
        // console.log('============>>>>>>>>>>>>>>>', totalPrice);
        this.dicount = totalPrice.toFixed(2);
        this.totalPrice = parseFloat(this.totalPrice) - totalPrice;
        // this.totalPrice = totalPrice;
        // console.log('------------>>>>', this.totalPrice);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
       // const tax = (parseFloat(this.totalPrice) * 21) / 100;
        //this.serviceTax = tax.toFixed(2);
        this.serviceTax=0;
        // console.log('tax->', this.serviceTax);
       // this.deliveryCharge = 5;
        this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.dishPrice);
        this.grandTotal = this.grandTotal.toFixed(2);
      } else {
        // console.log('curreny');
        const totalPrice = parseFloat(this.totalPrice) - this.coupon.discout;
        // console.log('============>>>>>>>>>>>>>>>', totalPrice);
        this.dicount = this.coupon.discout;
        this.totalPrice = totalPrice;
        // console.log('------------>>>>', this.totalPrice);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
        //const tax = (parseFloat(this.totalPrice) * 21) / 100;
      //  this.serviceTax = tax.toFixed(2);
      this.serviceTax=0;
        // console.log('tax->', this.serviceTax);
        //this.deliveryCharge = 5;
        this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.dishPrice);
        this.grandTotal = this.grandTotal.toFixed(2);

        
      }
    } else {
      // console.log('not satisfied');
      this.coupon = null;
      localStorage.removeItem('coupon');
    }
    // console.log('grand totla', this.grandTotal);
    if (this.totalItem === 0) {
      const lng = localStorage.getItem('language');
      const selectedCity = localStorage.getItem('selectedCity');
      await localStorage.clear();
      localStorage.setItem('language', lng);
      localStorage.setItem('selectedCity', selectedCity);
      this.totalItem = 0;
      this.totalPrice = 0;
      this.haveItems = false;
    }

    localStorage.setItem('totalItem', this.totalItem);
    localStorage.setItem('totalPrice', this.grandTotal);
  }
  // NEW calc

  getCurrency() {
    return this.util.getCurrecySymbol();
  }

  changeAddress() {
    const navData: NavigationExtras = {
      queryParams: {
        from: 'cart'
      }
    };
    this.router.navigate(['choose-address'], navData);
  }
  checkout() {
    console.log(this.totalPrice ,"قيمه الطلب")
    // console.log('check', this.grandTotal < 0)
    if(this.cart.length!==0&&this.cart){
    if (this.grandTotal < 0) {
      this.util.errorToast(this.util.translate('Something went wrong'));
      return false;
    }
    const navData: NavigationExtras = {
      queryParams: {
        from: 'cart'
      }
    };
    this.router.navigate(['choose-address'], navData);
    // this.router.navigate(['payments']);
  }
  else{
    
  }
  }
  openCoupon() {
    const navData: NavigationExtras = {
      queryParams: {
        restId: this.vid,
        name: this.name,
        totalPrice: this.totalPrice
      }
    };
    this.router.navigate(['coupons'], navData);
  }
}
