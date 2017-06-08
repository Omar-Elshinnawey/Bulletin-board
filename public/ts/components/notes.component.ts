import { Component, OnInit } from '@angular/core';
import {trigger, style, state, transition, animate} from '@angular/animations';
import {Router} from '@angular/router';

import {NotesService, ToastService} from '../services';
import {Group, Note} from '../models';

import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'notes',
    templateUrl: '/assets/views/notes.component.html',
    styleUrls: ['assets/css/notes.component.css'],
    animations: [
        trigger('showNotes', [
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

export class NotesComponent implements OnInit {

    private subs: Subscription[];
    group: Group;
    note: Note;
    showNotes = true;

    constructor(private notesService: NotesService, private router: Router, private toast: ToastService) { 
        this.subs = new Array();
        this.note = new Note();
        this.group = new Group();
    }

    ngOnInit() {
        var user = this.notesService.getUser();

        if(!user.group || user.group.length < 1){
            this.router.navigate(['groups']);
            return;
        }

        var sub = this.notesService.getNotes()
        .subscribe(
            (group) => {this.group = group},
            (err: string) => {this.toast.error(err)}
        );

        this.subs.push(sub);
    }

    create(){
        var sub = this.notesService.create(this.note.title, this.note.text)
        .subscribe(
            (message) => {this.toast.success(message)},
            (err: string) => {this.toast.error(err)}
        );

        this.subs.push(sub);
    }

    toggleState(){
        this.showNotes = !this.showNotes;
    }

    ngOnDestroy(){
         this.subs.forEach((sub) => sub.unsubscribe());
    }
}