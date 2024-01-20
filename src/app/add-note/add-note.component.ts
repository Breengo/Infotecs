import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { getApp } from '@angular/fire/app';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import EditorJS from '@editorjs/editorjs';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.scss',
})
export class AddNoteComponent implements AfterViewInit {
  @ViewChild('editor', { read: ElementRef, static: true })
  editorElement: ElementRef;

  private editor: EditorJS;

  error: string = '';
  imageData: string = '';
  displayImage: boolean = false;
  firestore: Firestore = inject(Firestore);
  file: File;

  constructor(private router: Router) {}

  private initializeEditor(): void {
    this.editor = new EditorJS({
      holder: this.editorElement.nativeElement,
      minHeight: 0,
    });
  }

  ngAfterViewInit(): void {
    this.initializeEditor();
  }

  onUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageData = e.target.result;
        this.displayImage = true;
      };
      this.file = file;
      reader.readAsDataURL(file);
    }
  }

  async onCreate(event: Event) {
    event.preventDefault();

    if (!this.file) return (this.error = 'Загрузите картинку');
    const data = await this.editor.save();
    if (data.blocks.length === 0) return (this.error = 'Введите текст');
    const app = getApp();
    const storage = getStorage(app, 'gs://notebook-6d586.appspot.com');
    const nRef = ref(storage, uuid.v4());
    await uploadBytes(nRef, this.file);
    await addDoc(collection(this.firestore, 'notes'), {
      text: JSON.stringify(data),
      date: new Date().getTime(),
      img: await getDownloadURL(nRef),
    });
    return this.router.navigate(['']);
  }
}
