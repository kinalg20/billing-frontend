import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private apiService: ApiService, private route: Router) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  ngOnInit() {
  }

  postLogin() {
    console.log(this.loginForm.controls);
    if (this.loginForm.valid) {
      this.apiService.loginpost(this.loginForm.value)
        .then((res) => {
          console.log(res);
          let data: any = res;
          localStorage.setItem('billing_token', JSON.stringify(data));
          this.route.navigateByUrl('/');
        })

        .catch((err) => {
          console.log(err);
        })
    }
  }

}
