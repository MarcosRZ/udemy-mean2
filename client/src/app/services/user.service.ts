import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import  'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UserService{

    public url: string;
    public identity;
    public token;


    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    signup(user, gethash = null){

        if (gethash != null){
            user.gethash = gethash;
        }

        let params = JSON.stringify(user);

        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this._http.post(this.url + '/login', params, {headers: headers})
        .map(res => res.json());
    }

    register(user){
       let params = JSON.stringify(user);

       let headers = new Headers({
           'Content-Type': 'application/json'
       });

       return this._http.post(this.url + '/register', params, {headers: headers})
       .map(res => res.json());
    }

    updateUser(user){
       let params = JSON.stringify(user);

       let headers = new Headers({
           'Content-Type': 'application/json',
           'Authorization': this.getToken()
       });

       return this._http.put(this.url + '/update-user/'+ user._id, params, {headers: headers})
       .map(res => res.json());
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'))

        if (identity != 'undefined'){
            console.log(identity)
            this.identity = identity;
        } else {
            this.identity = null
        }

        return this.identity;
    }

    getToken(){
        let token = JSON.parse(localStorage.getItem('token'))

        if (token != 'undefined'){
            this.token = token;
        } else {
            this.token = null
        }

        return this.token; 
    }

}