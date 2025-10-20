import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { IComments, ITask } from '../../../interfaces/task.interface';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { generateUniqueIdWithTimestamp } from '../../../utils/generate-unique-id-with-timestamp';

interface ICommentTaskModalData {
  Task: ITask;
}

@Component({
  selector: 'app-comment-task',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './comment-task.component.html',
})
export class CommentTaskComponent {
  readonly _data: ICommentTaskModalData = inject(DIALOG_DATA);
  readonly _dialogRef = inject(DialogRef);
  taskCommentChanged: boolean = false;

  readonly CommentForm = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  handleSubmit() {
    const newComment: IComments = {
      id: generateUniqueIdWithTimestamp(),
      text: this.CommentForm.value.text!,
      created_at: new Date().toString(),
    };

    this._data.Task.comments.unshift(newComment);

    this.CommentForm.reset();

    this.taskCommentChanged = true;
  }

  deleteComment(commentId: string) {
    this._data.Task.comments = this._data.Task.comments.filter(
      (e) => e.id !== commentId,
    );

    this.taskCommentChanged = true;
  }

  closeModal(taskCommentChanged: boolean) {
    this._dialogRef.close(taskCommentChanged);
  }
}
