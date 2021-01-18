import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router, NavigationExtras } from "@angular/router";
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  seg_id = 1;
  name: any;
  photo: any = 'assets/imgs/user.jpg';
  email: any;
  reviews: any = [];
  id: any;
  info: any=[];
  PhoneNum: any;
  constructor(
    private api: ApisService,
    private router: Router,
    private util: UtilService
  ) {
    this.util.getReviewObservable().subscribe(data => {
      console.log(data);
      this.getReview();
    });
    this.util.observProfile().subscribe(data => {
      this.getProfile();
    });
  }

  ngOnInit() {
    
    console.log("UID2",localStorage.getItem('uid2'))
    console.log("UID",localStorage.getItem('uid'))
    this.id=localStorage.getItem('uid2');
 this.info=localStorage.getItem("info");
 console.log("Info",this.info)
  }
  logout() {
    this.api.logout().then((data) => {
      this.router.navigate(['tabs']);
    }).catch(error => {
      console.log(error);
    });
  }

  goToAddress() {
    const navData: NavigationExtras = {
      queryParams: {
        from: 'accont'
      }
    };
    this.router.navigate(['choose-address'], navData);
  }

  ionViewWillEnter() {
    this.validate();
  }
  getReview() {
    this.api.getMyReviews(this.id).then((reviews) => {
      console.log(reviews);
      this.reviews = reviews;
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }
  getProfile() {
    this.api.getMyProfile(localStorage.getItem('uid2')).then((data: any) => {
      console.log('userdata', data);
      if (data) {
        this.name = data.fullname;
        this.photo = data && data.cover ? data.cover : 'assets/imgs/user.jpg';
        this.email = data.email;
        this.PhoneNum=data.PhoneNum
        this.id = localStorage.getItem("uid2");
        this.getReview();
      }
    }).catch(error => {
      console.log(error);
    });
  }

  validate() {
    this.api.checkAuth().then(async (user: any) => {
      if (user) {
       // localStorage.setItem('uid', user.uid);
       localStorage.getItem('uid2')
        this.getProfile();
      } else {
        this.router.navigate(['login']);
      }
    }).catch(error => {
      console.log(error);
    });
  }
  changeSegment(val) {
    this.seg_id = val;
  }

  goToselectRestaurants() {
    this.router.navigate(['/choose-restaurant']);
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
}
