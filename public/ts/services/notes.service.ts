import { Injectable } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Router} from '@angular/router';

import {User, Group, Note} from '../models';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NotesService {

    constructor(private http: Http, private router: Router) { }

    create(title: string, text: string): Observable<string>{
        var user = this.getUser();

        return this.http.post('/api/notes/create', {
            groupId: user.group,
            text: text,
            title: title
        }, this.getReqOptionsWithToken(user.token))
        .map((res: Response) => {
            return res.json().message;
        })
        .catch(this.handleError.bind(this));
    }

    getNotes(): Observable<Group>{
        var user = this.getUser();

        return this.http.get(`/api/notes/${user.group}`, this.getReqOptionsWithToken(user.token))
        .map((res: Response) => {
            var group = res.json() as Group;
            group.notes = group.notes as Note[];
            return group;
        })
        .catch(this.handleError.bind(this));
    }

    handleError(res: Response){
        if(res.status === 401)
            this.router.navigate(['register']);

        return Observable.throw(res.json().message);
    }

    getReqOptionsWithToken(token: string): RequestOptions{
        return new RequestOptions({
            headers: new Headers({
                token: token
            })
        });
    }

    getUser(): User{
        return JSON.parse(localStorage.getItem('user')) as User;
    }
}