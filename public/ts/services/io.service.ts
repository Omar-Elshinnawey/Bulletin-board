import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {Group} from '../models';

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
}