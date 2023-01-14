import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit{

    private titleSubject = new BehaviorSubject<string>('Users'); 
    public titleAction$ = this.titleSubject.asObservable();
    public users: User[] = [];
    private subscriptions: Subscription[] = [];
    private loggedInUserName?:string;
    public selectedUser?: User;

    constructor(
      private authenticationService: AuthenticationService, 
      private userService: UserService, 
      private router : Router, 
      private notificationService: NotificationService
      ) {}

    ngOnInit(): void { 
      if(!this.authenticationService.isUserLoggedIn()){
        this.router.navigateByUrl('/login'); 
      }else{
        this.loggedInUserName = this.authenticationService.getUserFromLocalStorage().firstname;
        this.getUsers(); 
      }
    }

    public getUsers(): void{
      this.subscriptions.push(
        this.userService.getUsers().subscribe(
          (response: User[]) => {
            this.users = response;
            console.log(response)
            this.sendNotification(NotificationType.SUCCESS, `Welcome ${this.loggedInUserName?.toUpperCase()} !!! .`)
          },
          (httpErrorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, httpErrorResponse.error.message);
          }
        )
      )
    }

    public onSelectUser(selectedUser: User){
      this.selectedUser  = selectedUser;
      document.getElementById("openUserInfo")?.click();
    }

    public changeTitle(title: string): void{ this.titleSubject.next(title); }

    private sendNotification(notificationType: NotificationType, message: string) : void {
    if(message){
      this.notificationService.notify(notificationType, message);
    }else{
      this.notificationService.notify(notificationType, 'Opps !! error occured, Please try again.')
    }
    }

}
