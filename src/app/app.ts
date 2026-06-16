import { Component } from '@angular/core';
import { ThemeToggle } from './theme-toggle';
import { ResourceGrid } from './resource-grid';

@Component({
  selector: 'app-root',
  imports: [ThemeToggle, ResourceGrid],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
