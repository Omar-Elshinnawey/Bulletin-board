import { Component, OnInit } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {Router} from '@angular/router';

import {Group, User} from '../models';

import {GroupService, ToastService, IOService} from '../services';

import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'group',
    templateUrl: '/assets/views/group.component.html',
    styleUrls: ['assets/css/group.component.css'],
    animations: [
        trigger('showState', [
            transition(':enter', [
                style({transform: 'translate(100%)', opacity: 0}),
                animate('0.3s 0.3s', style({
                    transform: 'translateX(0)', opacity: 1
                }))
            ]),
            transition(':leave', [
                style({transform: 'translate(0)', opacity: 1}),                
                animate('0.3s', style({
                    transform: 'translateX(100%)', opacity: 0
                }))
            ]) 
        ])
    ]
})

export class GroupComponent implements OnInit {

    groups: Group[];
    subs: Subscription[];
    groupName:string;
    showGroups = true;

    constructor(private groupService: GroupService, 
                public toast: ToastService, 
                public io: IOService, 
                private router: Router) {
        this.subs = new Array();
     }

    ngOnInit() {
        var user = JSON.parse(localStorage.getItem('user')) as User;

        if(user.group){
            this.router.navigate(['notes']);
            return;
        }

        var sub = this.groupService.getGroups()
        .subscribe(
            (groups) => { this.groups = groups },
            (err) => { this.toast.error(err) }
        );

        this.subs.push(sub);

        sub = this.io.ongroupcreated().subscribe((group) => {this.groups.push(group)});

        this.subs.push(sub);

        sub = this.io.ongroupdeleted().subscribe((group) => {
            var index = this.groups.findIndex(e => e._id === group._id);

            this.groups.splice(index, 1);
        });

        this.subs.push(sub);
    }

    onsubmit(){
        var sub = this.groupService.create(this.groupName)
        .subscribe(
            (message) => {
                this.toast.success(message);
                this.router.navigate(['notes']);
            },
            (err) => { this.toast.error(err) }
        );

        this.subs.push(sub);
    }

    join(group: Group){
        var sub = this.groupService.join(group._id)
        .subscribe(
            (message) => {
                var nickname = (JSON.parse(localStorage.getItem('user')) as User).nickname;
                
                this.toast.success(message);
                this.router.navigate(['notes']);
            },
            (error) => {
                this.toast.error(error);
            }
        );

        this.subs.push(sub);
    }

    toggleState(){
        this.showGroups = !this.showGroups;
    }

    ngOnDestroy(){
        this.subs.forEach((sub) => {sub.unsubscribe()});
    }
}