import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {Group, Note, User} from '../models';

@Injectable()
export class IOService {

    socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect('http://localhost:3000');
    }

    ongroupcreated(){
        return Observable.fromEvent(this.socket, 'groupCreated')
        .map((group: Group) => {
            return group;
        });
    }

    ongroupdeleted(){
        return Observable.fromEvent(this.socket, 'groupDeleted')
        .map((group: Group) => {
            return group;
        });
    }

    onnotecreated(){
        return Observable.fromEvent(this.socket, 'noteCreated')
        .map((note:Note) => {
            return note;
        });
    }

    join(groupId: string, nickname: string){
        this.socket.emit('join', {groupId: groupId, nickname: nickname});
    }

    onjoin(){
        return Observable.fromEvent(this.socket, 'joined')
        .map((nickname: string) => {
            return nickname;
        });
    }

    leave(groupId: string, nickname: string){
        this.socket.emit('leave', {groupId: groupId, nickname: nickname});
    }

    onleft(){
        return Observable.fromEvent(this.socket, 'left')
        .map((nickname: string) => {
            return nickname;
        });
    }
}