import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, collectionData, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];
  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (error) => { console.log(error) }
    );
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      );
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFromNote(note: Note): string {
    if (note.type == "note") {
      return "notes"
    } else {
      return "trash"
    }
  }

  async addNote(item: Note, colId: "notes" | "trash") {
    if (colId == "notes") {
      await addDoc(this.getNotesRef(), item).catch(
        (err) => { console.log(err) }
      ).then((docRef) => { console.log("Document written with ID: ", docRef?.id) })
    } else {
      await addDoc(this.getTrashRef(), item).catch(
        (err) => { console.log(err) }
      ).then((docRef) => { console.log("Document written with ID: ", docRef?.id) })
    }

  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = []
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));

      });
    });
  }

  subNotesList() {
    // let ref = collection(this.firestore, "notes/5Li4polKq6w5GvhaAYC0/notesExtra");
    let limitCount = query(this.getNotesRef(), limit(100));
    return onSnapshot(limitCount, (list) => {
      this.normalNotes = []
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
      // list.docChanges().forEach((change) => {
      //   if (change.type === "added") {
      //     console.log("New note: ", change.doc.data());
      //   }
      //   if (change.type === "modified") {
      //     console.log("Modified note: ", change.doc.data());
      //   }
      //   if (change.type === "removed") {
      //     console.log("Removed note: ", change.doc.data());
      //   }
      // });
    });
  }

  subMarkedNotesList() {
    let limitCount = query(this.getNotesRef(), where("marked", "==", true));
    return onSnapshot(limitCount, (list) => {
      this.normalMarkedNotes = []
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }


  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  setNoteObject(obj: any, id: string) {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: false,
    }
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


}
