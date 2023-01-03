import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy{

   public showLoading: boolean = false;
    private subscriptions: Subscription[] = [];

    constructor(private router : Router, private authenticationService : AuthenticationService, private notifier: NotificationService){}

    ngOnInit(): void { 

        if(this.authenticationService.isUserLoggedIn()){

            this.router.navigateByUrl('/user/management'); 

        }

    }

    public onRegister(user: User): void{

        this.showLoading = true;

        this.subscriptions.push(
            this.authenticationService.register(user).subscribe(
              (response: User) => {
                  this.showLoading = false; 
                  this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.firstname}. Please check your email for password to login.`)
              },
              (httpErrorResponse: HttpErrorResponse) => {
                console.log(httpErrorResponse);
                this.sendNotification(NotificationType.ERROR, httpErrorResponse.error.message);
                this.showLoading = false;
              }
            )
        );

    }
  private sendNotification(notificationType: NotificationType, message: string) : void {
    if(message){
      this.notifier.notify(notificationType, message);
    }else{
      this.notifier.notify(notificationType, 'Opps !! error occured, Please try again.')
    }
  }

    ngOnDestroy(): void { 
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}
