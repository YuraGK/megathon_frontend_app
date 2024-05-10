// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'https://23wxjt3rzi.execute-api.eu-north-1.amazonaws.com/dev',
  wsUrl: 'wss://9is6on8088.execute-api.eu-north-1.amazonaws.com/dev',
  cognito: {
    userPoolId: 'eu-north-1_IA6gIYqE5',
    clientId: '46a1tm3pfa35djvk42kh1gbjps'
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
