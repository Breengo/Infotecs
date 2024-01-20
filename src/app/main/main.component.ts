import { Component, OnInit, inject } from '@angular/core';
import { NoteComponent } from '../note/note.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { NoteSkeletonComponent } from '../note-skeleton/note-skeleton.component';

export interface Note {
  text: string;
  date: string;
  docId: string;
  img: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NoteComponent, CommonModule, RouterLink, NoteSkeletonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  loading: boolean = false;
  notes: Note[] = [];

  ngOnInit(): void {
    const getData = async () => {
      this.loading = true;
      const data = await getDocs(collection(this.firestore, 'notes'));
      this.notes = data.docs.map((doc) => {
        const data = doc.data() as Note;
        data.docId = doc.id;
        return data;
      });
      this.notes.sort(
        (noteA, noteB) => Number(noteB.date) - Number(noteA.date)
      );
      this.loading = false;
    };
    getData();
  }
}
