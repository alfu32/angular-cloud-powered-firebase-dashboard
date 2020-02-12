import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from '../core/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  item: Observable<UserProfile>;
  uid: string;
  loading = false;
  error: string;
  downloadUrl: Observable<string>;
  uploadProgress: Observable<number>;
  private itemDoc: AngularFirestoreDocument<UserProfile>;
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private auth: AuthService,
    private afstorage: AngularFireStorage,
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.downloadUrl = this.afstorage.ref(`users/${this.uid}/profile-image`)
      .getDownloadURL();
  }

  ngOnInit() {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.afAuth.auth.currentUser.uid}`)
    this.item = this.itemDoc.valueChanges();
  }
  async onSubmit(ngForm: NgForm) {
    this.loading = true;
    const {
      email,
      firstName,
      lastName,
      displayName,
      address,
      city,
      state,
      zip,
      phone,
      specialty,
      ip,
    } = ngForm.form.getRawValue();
    const userProfile = {
      uid: this.uid,
      email,
      displayName,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      phone,
      specialty,
      ip,
    };
    try {
      await this.auth.updateUserDocument(userProfile);
    } catch (err) {
      console.log(err);
      this.error = err.message;
    }
    this.loading = false;
  }
  fileChange(event) {
    this.downloadUrl = null;
    this.error = null;

    // get the file
    const file = event.target.files[0];
    // create file reference
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afstorage.ref(filePath);

    // upload and store the task;
    const task = this.afstorage.upload(filePath, file);

    // observe percentage changes
    this.uploadProgress = task.percentageChanges();

    // get notified when the dl url is available
    task.snapshotChanges()
      .pipe(
        finalize( () => {
          this.downloadUrl = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }

}
