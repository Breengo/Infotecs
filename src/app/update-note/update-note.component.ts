import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Note } from '../main/main.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import EditorJS from '@editorjs/editorjs';
import * as uuid from 'uuid';
import { getApp } from '@angular/fire/app';

type UpdatedNote = Omit<Note, 'date' | 'docId'>;

@Component({
  selector: 'app-update-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './update-note.component.html',
  styleUrl: './update-note.component.scss',
})
export class UpdateNoteComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', { read: ElementRef, static: true })
  editorElement: ElementRef;

  private editor: EditorJS;

  imageData: string = '';
  displayImage: boolean = false;
  firestore: Firestore = inject(Firestore);
  data: UpdatedNote = { text: '', img: '' };
  file: File | undefined;
  error: string;

  constructor(private routes: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.routes.snapshot.paramMap.get('id');
    const fetchDoc = async () => {
      const docRef = doc(this.firestore, 'notes', id ?? '');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.data = docSnap.data() as Note;
        this.editor.render(JSON.parse(this.data.text));
        this.displayImage = true;
      }
    };
    fetchDoc();
  }

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
        this.data.img = e.target.result;
        this.displayImage = true;
        this.file = file;
      };
      reader.readAsDataURL(file);
    }
  }

  async onUpdate(event: Event) {
    const id = this.routes.snapshot.paramMap.get('id');
    event.preventDefault();

    const data = await this.editor.save();
    if (data.blocks.length === 0) return (this.error = 'Введите текст');

    if (this.file) {
      const app = getApp();
      const storage = getStorage(app, 'gs://notebook-6d586.appspot.com');

      const nRef = ref(storage, uuid.v4());
      await uploadBytes(nRef, this.file);
      this.data.img = await getDownloadURL(nRef);
    }

    const docRef = doc(this.firestore, 'notes', id ?? '');
    await updateDoc(docRef, {
      img: this.data.img,
      text: JSON.stringify(await this.editor.save()),
    });
    return this.router.navigate(['']);
  }
}
