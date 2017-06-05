import { Component} from '@angular/core';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {User} from '../models';
import {RegisterService, ToastService} from '../services';

@Component({
    selector: 'register',
    templateUrl: '/assets/views/register.component.html',
    styleUrls:['assets/css/register.component.css']
})
export class RegisterComponent{

    private subs: Subscription[];
    private nickname: string;

    constructor(private reg: RegisterService, private router: Router, public toast: ToastService) {
        this.subs = new Array();     
     }

    ngOnInit() {
        var sub = this.reg.isAuth()
                    .subscribe(
                        (user: User) => { this.router.navigate(['groups'])},
                        (err: string) => {}
                    );

        this.subs.push(sub);
    }

    onsubmit(){
        var sub = this.reg.register(this.nickname)
        .subscribe(
            (user: User) => {this.router.navigate(['groups'])},
            (err: string) => {
                console.log(err);
                this.toast.error(err)}
        );

        this.subs.push(sub);
    }

    ngOnDestroy(){
        this.subs.forEach((sub:Subscription) => sub.unsubscribe());
    }
}