import { Component, OnInit } from '@angular/core';

import {Group} from '../models';

import {GroupService, ToastService, IOService} from '../services';

import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'group',
    templateUrl: '/assets/views/group.component.html'
})

export class GroupComponent implements OnInit {

    groups: Group[];
    subs: Subscription[];
    groupName:string;

    constructor(private groupService: GroupService, public toast: ToastService, public io: IOService) {
        this.subs = new Array();
     }

    ngOnInit() {
        var sub = this.groupService.getGroups()
        .subscribe(
            (groups) => { this.groups = groups },
            (err) => { this.toast.error(err) }
        );

        this.subs.push(sub);

        sub = this.io.ongroupcreated().subscribe((group) => {this.groups.push(group)});

        this.subs.push(sub);
    }

    onsubmit(){
        var sub = this.groupService.create(this.groupName)
        .subscribe(
            (message) => {this.toast.success(message)},
            (err) => { this.toast.error(err) }
        );

        this.subs.push(sub);
    }

    ngOnDestroy(){
        this.subs.forEach((sub) => {sub.unsubscribe()});
    }
}