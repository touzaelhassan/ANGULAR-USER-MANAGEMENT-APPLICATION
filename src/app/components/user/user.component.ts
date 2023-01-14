import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { CustomHttpRespone } from 'src/app/models/custom-http-response';
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
    public filename: any;
    public profileImage: any;
    public selectedUser?: any;
    public editedUser = new User();
    private currentUsername?: string;

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
        this.getUsers(true); 
      }
    }

    public getUsers(showNotification: boolean): void{
      this.subscriptions.push(
        this.userService.getUsers().subscribe(
          (response: User[]) => {
            this.users = response;
            if(showNotification){
              this.userService.addUsersToLocalStorage(this.users);
              this.sendNotification(NotificationType.SUCCESS, `Welcome ${this.loggedInUserName?.toUpperCase()} !!.`);
            }
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

    public onProfileImageChange(event:any): void{
      const files = event.target.files;
      this.profileImage = files[0];
      this.filename = files[0].name;
    }

    public saveNewUser(): void{ document.getElementById("new-user-save")?.click(); }

    public onAddNewUser(userForm: NgForm): void{
      const formData = this.userService.createUserFormDate(null, userForm, this.profileImage);
      this.subscriptions.push(
        this.userService.addUser(formData).subscribe(
          (response: any) =>{
            document.getElementById("new-user-close")?.click();
            this.sendNotification(NotificationType.SUCCESS, `The new user was added successfully !!.`);
            this.getUsers(false);
            this.profileImage = null;
            this.filename = null;
            userForm.reset();
          },  
          (httpErrorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, httpErrorResponse.error.message);
            this.profileImage = null;
          }
        )
      )
    }

    public onEditUser(user: User): void{
      this.editedUser = user;
      this.currentUsername = user.username;
      document.getElementById("openUserEdit")?.click();
    }

    public onUpdateUser(): void{
      const formData = this.userService.createUserFormDate(this.currentUsername, this.editedUser , this.profileImage);
      this.subscriptions.push(
        this.userService.updateUser(formData).subscribe(
          (response: any) =>{
            document.getElementById("closeEditUserModalButton")?.click();
            this.sendNotification(NotificationType.SUCCESS, `The user information were updated successfully !!.`);
            this.getUsers(false);
            this.profileImage = null;
            this.filename = null;
          },  
          (httpErrorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, httpErrorResponse.error.message);
            this.profileImage = null;
          }
        )
      )
    }

    public searchInUsersList(keyword: string){

      const searchResults: User[] = [];

      for (const user of this.userService.getUsersFromLocalStorage()){
        if(
          user.firstname.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1 || 
          user.lastname.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1 ||
          user.username.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1 
        ){
          searchResults.push(user);
        }
      }

      this.users = searchResults
      if (searchResults.length == 0 || !keyword) { this.users = this.userService.getUsersFromLocalStorage(); }

    }


    public onDelete(id: any){
      this.subscriptions.push(
        this.userService.deleteUser(id).subscribe(
          (response: CustomHttpRespone)=>{
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.getUsers(false);
          },
           (httpErrorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, httpErrorResponse.error.message);
          }
        )
      )
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
