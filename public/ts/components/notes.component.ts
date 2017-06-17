import { Component, OnInit } from '@angular/core';
import {trigger, style, state, transition, animate} from '@angular/animations';
import {Router} from '@angular/router';

import {NotesService, ToastService, RegisterService} from '../services';
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

    constructor(private notesService: NotesService, 
                private router: Router, 
                private toast: ToastService,
                public registerService: RegisterService) { 
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
            (group) => {
                this.group = group
                this.group.notes.forEach(note => note.color = this.getRandColor());
            },
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

    getRandColor(){
        var colors = [  '#63CCEC', '#FFE339', '#FBAD6B',
                        '#F9666E', '#F7A9C3', '#C197C7', 
                        '#3C9BD5', '#CFE38C', '#10B1AC',
                        '#E7523C', '#E75335', '#FAB8A2' ];

        return colors[Math.floor(Math.random() * colors.length)];
    }

    logout(){
        this.registerService.logout().
        toPromise()
        .then(res => {
            this.router.navigate(['register']);
        })
        .catch(message => this.toast.error(message));
    }
}