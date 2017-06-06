import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {User, Group, Note} from '../models';

@Injectable()
export class GroupService {

    constructor(private http: Http, private router: Router) { }

    getGroups(): Observable<Group[]>{
        return this.http.get('/api/groups', this.getReqOptionsWithToken())
        .map((res: Response) => {
            return res.json() as Group[]
        })
        .catch(this.handleError.bind(this));
    }

    create(name: string): Observable<string>{
        return this.http.post('/api/groups/create', {'name': name}, this.getReqOptionsWithToken())
        .map((res: Response) => {
            var user = JSON.parse(localStorage.getItem('user')) as User;

            user.group = res.json().groupId;

            localStorage.setItem('user', JSON.stringify(user));

            return res.json().message;
        })
        .catch(this.handleError.bind(this));
    }

    join(id: string): Observable<string>{
        return this.http.post('/api/groups/join', {'groupId': id}, this.getReqOptionsWithToken())
        .map((res: Response) => {
            var user = JSON.parse(localStorage.getItem('user')) as User;

            user.group = id;

            localStorage.setItem('user', JSON.stringify(user));

            return res.json().message;
        })
        .catch(this.handleError.bind(this));
    }

    getReqOptionsWithToken(): RequestOptions{
        var token = (JSON.parse(localStorage.getItem('user')) as User).token;

        return new RequestOptions({
            headers: new Headers({
                'token': token,
                'Content-Type': 'application/json'
            })
        });
    }

    handleError(res: Response){
        if(res.status === 401)
                this.router.navigate(['register']);
            
        return Observable.throw(res.json().message);
    }
}