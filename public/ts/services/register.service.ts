import { Injectable } from '@angular/core';

import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {CanActivate, Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import {User} from '../models';

@Injectable()
export class RegisterService implements CanActivate {

    constructor(private http: Http, private router: Router) { }

    register(nickname: string){
        var headers = this.setHeaders();
        var opts = new RequestOptions({headers: headers});

        return this.http.post('/api/auth/login', {nickname: nickname}, opts)
        .map((res: Response) => {
            var user = res.json() as User;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        })
        .catch((res: Response) => {
            return Observable.throw(res.json().message);
        });
    }

    logout(){
        if(!localStorage.getItem('user'))
            return;
        
        var token = JSON.parse(localStorage.getItem('user')).token;

        var headers = this.setHeadersWithToken(token);
        var opts = new RequestOptions({headers: headers});

        return this.http.post('/api/auth/logout',{}, opts)
        .map((res: Response) => {
            return res.json();
        })
        .catch((res: Response) => {
            return Observable.throw(res.json().message);
        })
    }

    isAuth(): Observable<User>{
        if(!localStorage.getItem('user'))
            return Observable.throw('You are not logged in');

        var token = JSON.parse(localStorage.getItem('user')).token;
        
        var headers = this.setHeadersWithToken(token);
        var opts = new RequestOptions({headers: headers});

        return this.http.get('/api/auth/isAuth', opts)
        .map((res: Response) => {
            return res.json() as User;
        })
        .catch((res: Response) => {
            return Observable.throw(res.json().message);
        });
    }

    canActivate(){
        return this.isAuth()
        .toPromise()
        .then((user: User) => {
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        })
        .catch((message: string) => {
            this.router.navigate(['register']);
            return false;
        });
    }

    private setHeaders(): Headers{
        return new Headers({
            'Content-Type': 'application/json'
        });
    }

    private setHeadersWithToken(token: string): Headers{
        return new Headers({
            'Content-Type': 'application/json',
            'token': token
        });
    }
}