import { Component, OnInit } from '@angular/core';

import { Platform,NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from './pages/home/home.page';
import { CategoryHomePage } from './pages/category-home/category-home.page';
import { CartPage } from './pages/cart/cart.page';
import { HistoryPage } from './pages/history/history.page';
import { AccountPage } from './pages/account/account.page';
import { ChooseAddressPage } from './pages/choose-address/choose-address.page';
import { CitiesPage } from './pages/cities/cities.page';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
   {
      title: 'الرئيسية',
      url: '/categoryhome',
      icon: 'fast-food-outline'
    },
	{
      title: 'السلة ',
      url: '/cart',
      icon: 'cart-outline'
    },
   
    {
      title: 'طلبات سابقة',
      url: '/history',
      icon: 'document-outline'
    },
    
    {
      title: 'الأشعارات',
      url: '/account',
      icon: 'notifications-outline'
    },
	
	  {
      title: 'العناوين ',
      url: '/choose-address',
      icon: 'location-outline'
    },
	
	  {
      title: 'حسابي',
      url: '/account',
      icon: 'people-outline'
    },
	  {
      title: 'اختر المدينة / اللغة',
      url: '/cities',
      icon: 'globe-outline'
    },
	{
      title: 'خدمة العملاء',
      url: '/',
      icon: 'chatbubble-ellipses-outline'
    },
	{
      title: 'اتصل بنا',
      url: '/',
      icon: 'call-outline'
    }
	
  ];
  pages: { title: string; component: any; icon: string; }[];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private oneSignal: OneSignal,
    private translate: TranslateService,
    public navCtrl: NavController
  ) {
    const lng = localStorage.getItem('language');
    if (!lng || lng === null) {
      localStorage.setItem('language', 'en');
    }
    
    // this.pages = [
    //   { title: 'الرئيسية', component: CategoryHomePage,icon:"home" },
    //   { title: 'السلة', component: CartPage,icon:"pricetags" },
    //   { title: 'طلبات سابقة', component: HistoryPage,icon:"images" },
    //   { title: ' الاشعارات', component: AccountPage,icon:"information-circle" },
    //   { title: 'العناوين', component: ChooseAddressPage,icon:"call" },
    //   { title: 'حسابي', component: AccountPage,icon:"logo-instagram" },
    //   { title: 'اختار المدينة', component: CitiesPage,icon:"logo-instagram" },
    //   { title: 'خدمة العملاء',component:"" ,icon:"logo-instagram" },
    //   { title: ' اتصل بنا',component:"" ,icon:"logo-instagram" },
    //   // { title: 'تواصل مع موظفنا', component: ChatRoomPage,icon:"logo-instagram" },
    
    // ];
    this.translate.use(localStorage.getItem('language'));
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('appid', environment.onesignal.appId);
      console.log('googlenumnner', environment.onesignal.googleProjectNumber);
      if (this.platform.is('cordova')) {
        setTimeout(async () => {
          await this.oneSignal.startInit(environment.onesignal.appId, environment.onesignal.googleProjectNumber);
          this.oneSignal.getIds().then((data) => {
            console.log('iddddd', data);
            localStorage.setItem('fcm', data.userId);
          });
          await this.oneSignal.endInit();
        }, 200);
  
        window["plugins"].OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});
    
      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      }
      var iosSettings = {};
      iosSettings["kOSSettingsKeyAutoPrompt"] = false;
      iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
      
      window["plugins"].OneSignal
        .startInit("02c411f0-f42a-4506-a47f-871ac9625792")
        .handleNotificationOpened(notificationOpenedCallback)
        .iOSSettings(iosSettings)
        .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
        .endInit();
      
      // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
      window["plugins"].OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
      });
   
     }
         // Camera.getPicture().then((fileUri) => url = fileUri);
        else {
         // You're testing in browser, do nothing or mock the plugins' behaviour.
         //
         // var url: string = 'assets/mock-images/image.jpg';
        }
     
      this.platform.backButton.subscribe(async () => {
        console.log('asd', this.router.url, 'ad', this.router.isActive('/tabs/', true))
        if (this.router.url.includes('/tabs/') ) {
          this.router.navigate(['tabs/tab1']);
        }
   else if(this.router.url.includes('/login')){
     navigator['app'].exitApp();
   }
   else{
     this.navCtrl.back();
   }
      });
      
      this.statusBar.backgroundColorByHexString('#37b44e');
      this.splashScreen.hide();

     
    });
    
  
   // Set your iOS Settings
  
}
  
  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  openPage(url) {
    console.log("URL",url)
    if(url=="/categoryhome"){
      this.router.navigate(['tabs/tab1']);
    }
    else if(url=="/cart"){
      this.router.navigate(['tabs/tab3']);
    }
    else{
this.navCtrl.navigateRoot(url)
    }
    
    
  }
 
}
