
var admin = require("firebase-admin");
var uid = process.argv[2];

// var serviceAccount = require("./angular-firebase-grid-da-7a55d-firebase-adminsdk-mrn1u-7b7e2eae19.json");
var serviceAccount = require("./angular-firebase-grid-da-7a55d-firebase-adminsdk-mrn1u-ebb1403b28.json");

console.log(uid);
console.log(serviceAccount);
// const appInit = {
//   serviceAccountId: "firebase-adminsdk-mrn1u@angular-firebase-grid-da-7a55d.iam.gserviceaccount.com",
// };
const appInit = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angular-firebase-grid-da-7a55d.firebaseio.com"
             // https://angular-firebase-grid-da-7a55d.firebaseio.com
};
console.log(appInit);
admin.initializeApp(appInit);

admin.auth().setCustomUserClaims( uid, {admin: true})
  .then( (r) => {
    console.log(r);
    console.log(`custom claims set for user ${uid}`);
    process.exit();
  })
  .catch( (err) => {
    console.log('== ERROR ===================================');
    console.error(`error seting custom claims for user ${uid} err.message`);
    console.log('--------------------------------------------');
    console.error(err.message);
    console.log('============================================');
    console.error(err.stack);
    process.exit(1);
  });
