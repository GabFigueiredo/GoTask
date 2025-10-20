import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { TaskStatusComponent } from '../task-status/task-status.component';

@Component({
  selector: 'app-main',
  imports: [HeroComponent, TaskStatusComponent],
  templateUrl: './main.component.html',
})
export class MainComponent {}
