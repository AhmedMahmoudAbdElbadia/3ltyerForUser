import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { notDeepStrictEqual } from 'assert';

@Component({
  selector: 'app-variations',
  templateUrl: './variations.page.html',
  styleUrls: ['./variations.page.scss'],
})
export class VariationsPage implements OnInit {
  productName: any = '';
  desc: any = '';
  total: any = 0;
  lists: any;
  cart: any[] = [];
  userCart: any[] = [];
  cover: any;
 notes :string;
  sameProduct: boolean = false;
  removeProduct: boolean = false;

  radioSelected: any;
  haveSize: boolean;


  newItem: boolean = false;

  sameCart: any[] = [];
  quantitty: any;
  id: any;
  idcart: any;
  idusercart: any;
  fid: any;
  ufid: any;
  deliveryCharge: any;
  constructor(
    private modalController: ModalController,
    private navParma: NavParams,
    private util: UtilService
  ) {
   this.deliveryCharge= localStorage.getItem("dishPrice") 
      console.log("info deliveryCharge",this.deliveryCharge);
    const info = this.navParma.get('food');
    this.productName = info.name;
    this.desc = info.desc;
    this.lists = info.variations;
    // this.deliveryCharge=info.deliveryCharge;

    const userCart = localStorage.getItem('userCart');
    this.haveSize = info.size;
    this.cover = info.cover;
    console.log(this.lists);
    this.lists.forEach(el => {
      el.items.forEach(item => {
        //if(!item.quantity) {
          item.quantity = 0;
        //}
      });
    });
    if (userCart && userCart !== 'null' && userCart !== undefined && userCart !== 'undefined') {
      this.userCart = JSON.parse(userCart);
      // const sameItem = this.userCart.filter(x => x.id === info.id);
      // if (sameItem.length > 0) {
      //   this.sameProduct = true;
      //   this.sameCart = sameItem[0].selectedItem;
      // }
    } else {
      this.userCart = [];
    }
  }

  ngOnInit() {
    // const info = this.navParma.get('food');
    // this.productName = info.name;
    // this.desc = info.desc;
    // this.lists = info.variations;
    // this.deliveryCharge=info.deliveryCharge;
    // console.log("info deliveryCharge",this.deliveryCharge);
  }
  closeIt() {
    this.modalController.dismiss();
  }

  radioGroupChange(event, title) {
    const radioList = this.lists.filter(x => x.title === title);
    const selectedItems = radioList[0].items.filter(x => x.title === event.detail.value);
console.log(this.lists,"LIST")
    this.lists.forEach(list => {
      if(list.title == title){
        list.items.forEach(item => {
          if(item.title == event.detail.value) {
            item.quantity = 1;
          }
          else{
            item.quantity = 0;
          }
        });
      }
    });

    console.log('selected item', selectedItems);

    const price = parseFloat(selectedItems[0].price);
    const param = {
      type: title,
      value: price,
      name: selectedItems[0].title,
      quantity: 1,
      




    };
    const item = this.cart.filter(x => x.type === title);
    if (item && item.length) {
      const index = this.cart.findIndex(x => x.type === title);
      this.cart[index].value = price;
    } else {
      this.cart.push(param);
    }
    console.log('cart', this.cart);
    this.calculate();
  }


  getSymobol() {
    return this.util.getCurrecySymbol();
  }
  sameChoise() {
    this.modalController.dismiss(this.sameCart, 'sameChoice');
  }
  addToCart() {
    /*
      new
      sameChoice
      newCustom
      remove
    */
 

    const addedSize = this.cart.filter(x => x.type === 'size');
    console.log("addsize" ,addedSize);
    let role;
    if (this.haveSize && !addedSize.length) {
      console.log('no size added');
      this.util.errorToast('Please select size');
      return false;
    }
    if (this.cart.length && !this.userCart.length) {
      role = 'new';
    }
    if (this.cart.length && this.userCart.length) {
      role = 'new';
    }
    if (!this.cart.length) {
      role = 'dismissed';
    }
    if (this.newItem) {
      role = 'newCustom';
    }
    this.modalController.dismiss(this.cart, role);
    const param = {
      value: 0,
      quantity:0,
      notes:this.notes,
      dishPrice:this.deliveryCharge
     


    };
 
    this.userCart.filter(z=>{
      this.ufid=z.id
    })
   console.log(this.cart,".....CART")
   console.log(this.userCart,".....UserCART")
    this.cart.push(param);
    
    this.calculate();
    

  }

  checkedEvent(event, title, itemprice, itemTitle) {
    console.log(this.lists,"LIST1")
    this.lists.forEach(list => {
      if(list.title == itemTitle){
        list.items.forEach(item => {
          if(item.title == title && item.price == itemprice) {
            if(event.detail.checked){
              item.quantity = 1;
            }
            else{
              item.quantity = 0;
            }
          }
        });
      }
      
    });
    console.log(this.lists,"LIST2")
    const price = parseFloat(event.detail.value);
    const param = {
      type: title,
      value: price,
      name: title,
      quantity:1,
      


    };
    if (event.detail && event.detail.checked) {
      this.cart.push(param);
    } else {
      this.cart = this.cart.filter(x => x.type !== title);
    }
    this.calculate();
  }

  addQ(index) {
    // this.userCart[index].quantiy = this.userCart[index].quantiy + 1;
    if(!this.sameCart[index].total){
      this.sameCart[index].total = 0;
    }
    this.sameCart[index].total = this.sameCart[index].total + 1;
  }

  removeQ(index) {
    // if (this.userCart[index].quantiy !== 0) {
    //   this.userCart[index].quantiy = this.userCart[index].quantiy - 1;
    //   if (this.userCart[index].quantiy === 0) {
    //     this.modalController.dismiss(this.cart, 'remove');
    //   }
    // }
    if(!this.sameCart[index].total){
      this.sameCart[index].total = 0;
    }
    this.sameCart[index].total = this.sameCart[index].total - 1;
    if (this.sameCart[index].total === 0) {
      this.sameCart = this.sameCart.filter(x => x.total !== 0);
    }

    if (this.sameCart.length < 0) {
      this.modalController.dismiss(this.cart, 'remove');
    }
  }

  add(i,j){
    if(!this.lists[i].items[j].quantity){
      this.lists[i].items[j].quantity = 0;
    }
    this.lists[i].items[j].quantity = this.lists[i].items[j].quantity + 1;
    this.cart.forEach(c => {
      if(c.name == this.lists[i].items[j].title){
        c.quantity = this.lists[i].items[j].quantity;
        this.quantitty=  c.quantity;
      }
    });
    this.calculate();
  }

  remove(i,j){
    if(!this.lists[i].items[j].quantity){
      this.lists[i].items[j].quantity = 0;
      return;
    }
    else if(this.lists[i].items[j].quantity > 1){
      this.lists[i].items[j].quantity = this.lists[i].items[j].quantity - 1;
    }
    this.cart.forEach(c => {
      if(c.name == this.lists[i].items[j].title){
        c.quantity = this.lists[i].items[j].quantity;
      }
    });
    this.calculate();
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }

  calculate() {
    this.total = 0;
    this.cart.forEach(item => {
      if(item.value && item.quantity > 0){
        this.total = this.total + (parseFloat(item.value) * parseInt(item.quantity));
      }
    });
  }
}
