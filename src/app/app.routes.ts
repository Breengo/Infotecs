import { Routes } from '@angular/router';

import { AddNoteComponent } from './add-note/add-note.component';
import { MainComponent } from './main/main.component';
import { UpdateNoteComponent } from './update-note/update-note.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'create', component: AddNoteComponent },
  { path: 'update/:id', component: UpdateNoteComponent },
];
