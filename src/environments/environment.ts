// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAevN_oAehEMy4NyOItZB1uAL0NNkuq39U",
    authDomain: "shop-cb6b5.firebaseapp.com",
    databaseURL: "https://shop-cb6b5.firebaseio.com",
    projectId: "shop-cb6b5",
    storageBucket: "shop-cb6b5.appspot.com",
    messagingSenderId: "826409173518",
    appId: "1:826409173518:web:6f9ce61931a5bff98a725f",
    measurementId: "G-TEQSZN4764"
  },
  onesignal: {
    appId: '',
    googleProjectNumber: '',
    restKey: ''
  },
  stripe: {
    sk: ''
  },
  paypal: {
    sandbox: '',
    production: 'YOUR_PRODUCTION_CLIENT_ID'
  },
  general: {
    symbol: 'ج.م',
    code: 'USD'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
