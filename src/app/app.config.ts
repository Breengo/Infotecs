import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'notebook-6d586',
          appId: '1:379938759592:web:185657f36a5929cf1f739d',
          storageBucket: 'notebook-6d586.appspot.com',
          apiKey: 'AIzaSyCcVS7Ac-SKjQJqqAC7DGjqiYe38NePM68',
          authDomain: 'notebook-6d586.firebaseapp.com',
          messagingSenderId: '379938759592',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'notebook-6d586',
          appId: '1:379938759592:web:185657f36a5929cf1f739d',
          storageBucket: 'notebook-6d586.appspot.com',
          apiKey: 'AIzaSyCcVS7Ac-SKjQJqqAC7DGjqiYe38NePM68',
          authDomain: 'notebook-6d586.firebaseapp.com',
          messagingSenderId: '379938759592',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
};
