import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html'
})
export class RegisterPageComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      name: this.form.value.name,
    };

    this.auth.register(user).subscribe(
      () => {
        this.form.reset();
        this.router.navigate(['/login'], {
          queryParams: {
            success: true,
          },
        });
        this.submitted = false;
      },
      () => {
        this.submitted = false;
      }
    );
  }
}
