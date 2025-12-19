import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = { fullName: '', email: '', institution: '', password: '' };
  
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.formData).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => alert('Erreur inscription')
    });
  }
}