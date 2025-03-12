import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-24c8a","appId":"1:860950849272:web:b8abaa4ce4d59d2a82fd0d","storageBucket":"danotes-24c8a.firebasestorage.app","apiKey":"AIzaSyBGOnMMGV3n6rVQgOBI6psLdN4g39t35IQ","authDomain":"danotes-24c8a.firebaseapp.com","messagingSenderId":"860950849272"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
