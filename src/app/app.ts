import { Component } from '@angular/core';
import { ThemeToggle } from './theme-toggle';
import { ResourceGrid } from './resource-grid';
import { AuthButton } from './auth-button';

@Component({
  selector: 'app-root',
  imports: [ThemeToggle, ResourceGrid, AuthButton],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
