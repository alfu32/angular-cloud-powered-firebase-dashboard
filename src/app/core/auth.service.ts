import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserProfile } from './user-profile.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }
  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['']);
  }
  isLoggedIn() {
    return !!this.afAuth.auth.currentUser;
  }
  createUserDocument(firstName, lastName) {
    // get current user;
    const user = this.afAuth.auth.currentUser;
    // create the object document with new data;
    const userProfileObject: UserProfile = {
      uid: user.uid,
      displayName: user.displayName,
      firstName,
      lastName,
      email: user.email,
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      specialty: '',
      ip: '',
    };
    // write to Cloud Firestore;
    return this.afs.doc(`users/${user.uid}`).set(userProfileObject);
  }
  // tslint:disable-next-line: max-line-length
  updateUserDocument(userProfile: UserProfile) {
    return this.afs.doc(`users/${userProfile.uid}`).update(userProfile);
  }
}
