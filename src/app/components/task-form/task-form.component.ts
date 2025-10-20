import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITaskFormControls } from '../../../interfaces/task-form-controls.interface';
import { TaskService } from '../../services/task.service';

export interface ITaskFormModalData {
  mode: 'create' | 'edit';
  formValues: ITaskFormControls;
}

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  readonly _data: ITaskFormModalData = inject(DIALOG_DATA);
  readonly _dialogRef = inject(DialogRef);
  readonly _taskService = inject(TaskService);

  taskForm: FormGroup = new FormGroup({
    name: new FormControl(this._data.formValues.name, [
      Validators.required,
      Validators.minLength(5),
    ]),
    description: new FormControl(this._data.formValues.description, [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  handleSubmit() {
    const payload = this.taskForm.value;
    this.closeModal(payload);
  }

  closeModal(formValues: ITaskFormControls | undefined = undefined) {
    this._dialogRef.close(formValues);
  }
}
