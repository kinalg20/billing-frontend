import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppUtility } from 'src/app/apputitlity';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private apiService: ApiService, private route: Router , private utility : AppUtility , private messageService: MessageService) { }

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
          this.showToast('success' , data.message)
          this.utility.loader(false);
          this.route.navigateByUrl('/');
        })

        .catch((err) => {
          console.log(err);
          this.utility.loader(false);
          this.showToast('error' , err.message)
        })
    }
  }

  
  showToast(type: any, details: any) {
    this.messageService.add({ severity: type, summary: this.utility.capitalizeFirstLetter(type), detail: details });
  }


}
