import { Component, OnInit } from '@angular/core';
import { login } from 'src/app/interfaces/login';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { phone_num } from 'src/app/interfaces/phone_num';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: login = { email: '', password: '' };
  PhoneNum:phone_num={PhoneNum:''}
  submitted = false;
  isLogin: boolean = false;
  verificationId:any;
  code:string="";
  windowRef: any;
  applicationVerifier: firebase.auth.RecaptchaVerifier;
  // PhoneNum: string;
  loginformview:boolean;
  phone: any;
  codesended:boolean;
  UserData: any;
  
  constructor(
    private router: Router,
    private api: ApisService,
    private util: UtilService,
    private navCtrl: NavController,
    private translate: TranslateService,
    private oneSignal: OneSignal,
    private fireAuth: AngularFireAuth,
  ) {
    const lng = localStorage.getItem('language');
    if (!lng || lng === null) {
      localStorage.setItem('language', 'en');
    }
    this.translate.use(localStorage.getItem('language'));
    this.oneSignal.getIds().then((data) => {
      console.log('iddddd==========', data);
      localStorage.setItem('fcm', data.userId);
    });
  }

  ngOnInit() {
    this.loginformview=true;
    this.codesended=false;
    // window["Plugins"].recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //   'size': 'invisible',
    //   'callback': function(response) {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     //onSignInSubmit();
    //   }
    // });
    // window["Plugins"].recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    
     
  }

  onLogin(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    if (form.valid) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
        return false;
      }
      console.log('login');
      this.isLogin = true;
      this.api.login(this.login.email, this.login.password).then((userData) => {
        console.log(userData);
        this.UserData=userData;
        this.api.getProfile(userData.uid).then((info) => {
          console.log(info);
          localStorage.setItem("info",info);
          if (info && info.status === 'active') {
            localStorage.setItem('uid2', userData.uid);
            localStorage.setItem('help', userData.uid);
            this.isLogin = false;
            this.util.publishLoggedIn('LoggedIn');
            // this.navCtrl.back();
            //this.loginformview=false;
          //  this.phone=info.PhoneNum;
           this.router.navigate(['/']);
          // this.loginWihPhone(this.phone);
          } else {
            Swal.fire({
              title: this.util.translate('Error'),
              text: this.util.translate('Your are blocked please contact administrator'),
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: this.util.translate('Need Help?'),
              backdrop: false,
              background: 'white'
            }).then(data => {
              if (data && data.value) {
                localStorage.setItem('help', userData.uid);
                this.router.navigate(['inbox']);
              }
            });
          }
        }).catch(err => {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        });
      }).catch(err => {
        if (err) {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        }
      }).then(el => this.isLogin = false);
    }
  }

  resetPass() {
    this.router.navigate(['/forgot']);
  }

  register() {
    this.router.navigate(['register']);
  }

  getClassName() {
    return localStorage.getItem('language');
  }
  changeLng(lng) {
    localStorage.setItem('language', lng);
    this.translate.use(lng);
  }

//   loginWihPhone(phone){
//    // this.api.loginWithPohne();
//    this.codesended=true;
//    console.log("phonenumber"+phone)
//     this.applicationVerifier  = new firebase.auth.RecaptchaVerifier('recaptcha-container',
//     { size: 'invisible' })
    
//  this.fireAuth.auth.signInWithPhoneNumber("+2"+phone,this.applicationVerifier ).then((result) => {
//   this.verificationId= result.verificationId
//   this.applicationVerifier.clear()
//   this.UserData=result;
//   console.log("Done",this.UserData)
//   localStorage.getItem('uid2');
//   //let code = this.getCodeFromUserInput();

// })
// .catch (error => {
//   console.log(error)
//   this.applicationVerifier.clear()
//   this.logout();
// })


//   //   (window as any).FirebasePlugin.signInWithPhoneNumber("+201556279190", 60, function(credential) {
//   //     console.log(credential);
//   //     alert("sms send successfuly")
  
//   //     // ask user to input verificationCode:
     
  
//   //     this.verificationId = credential.verificationId;
      

//   // }, function(error) {
//   //     console.error(error);
//   // });
//   }
  logout() {
    this.api.logout().then((data) => {
      this.router.navigate(['tabs']);
    }).catch(error => {
      console.log(error);
    });

  }
  // verfiy(){
    
  //   let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.code);
  // firebase.auth().currentUser.reauthenticateWithCredential(signInCredential).then((info)=>{
     
    
  //       console.log(info)
  //       this.router.navigate(['/']);
  //     },(error)=>{
        
  //     console.log(error)
     
  //   })
  //   firebase.auth().signInWithCredential(signInCredential).then((info)=>{
     
    
  //     console.log(info)
  //     this.router.navigate(['/']);
  //   },(error)=>{
      
  //   console.log(error)
   
  // })
//}
}
