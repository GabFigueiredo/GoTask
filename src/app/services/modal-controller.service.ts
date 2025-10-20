import { inject, Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormComponent } from '../components/task-form/task-form.component';
import { ITaskFormControls } from '../../interfaces/task-form-controls.interface';
import { CommentTaskComponent } from '../components/comment-task/comment-task.component';
import { ITask } from '../../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalControllerService {
  private readonly _dialog = inject(Dialog);
  private readonly sizeProperties = {
    maxWidth: '617px',
    width: '95%',
  };

  openNewTaskModal() {
    return this._dialog.open<ITaskFormControls>(TaskFormComponent, {
      ...this.sizeProperties,
      disableClose: true,
      data: {
        mode: 'create',
        formValues: {
          name: '',
          description: '',
        },
      },
    });
  }

  openEditModal(formValues: ITaskFormControls) {
    return this._dialog.open<ITaskFormControls>(TaskFormComponent, {
      ...this.sizeProperties,
      disableClose: true,
      data: {
        mode: 'edit',
        formValues,
      },
    });
  }

  openCommentsModal(Task: ITask) {
    return this._dialog.open<boolean>(CommentTaskComponent, {
      ...this.sizeProperties,
      disableClose: true,
      data: {
        Task,
      },
    });
  }
}
