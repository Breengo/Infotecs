import EditorJS, { OutputData } from '@editorjs/editorjs';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { Note } from '../main/main.component';
import { Firestore, deleteDoc, doc } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent implements AfterViewInit {
  @Input() data: Note;
  @ViewChild('editor', { read: ElementRef, static: true })
  editorElement: ElementRef;

  private editor: EditorJS;
  firestore: Firestore = inject(Firestore);

  private initializeEditor(): void {
    this.editor = new EditorJS({
      holder: this.editorElement.nativeElement,
      minHeight: 0,
      readOnly: true,
      data: JSON.parse(this.data.text),
    });
  }

  ngAfterViewInit(): void {
    this.initializeEditor();
  }

  async onDelete(event: Event) {
    event.preventDefault();
    await deleteDoc(doc(this.firestore, 'notes', this.data?.docId ?? ''));
    window.location.reload();
  }

  getFormatedDate() {
    if (!this.data) return '';
    const date = new Date(this.data.date);
    const formatedDate = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}`;
    return formatedDate;
  }
}
