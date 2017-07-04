import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {

    public title:string;
    public user: User;
    public url: string;
    public identity;
    public token;
    public alertMessage;

    constructor(private _userService: UserService){
        this.title = 'Actualizar mis datos'

        // LocalStorage
        this.token = this._userService.getToken();
        this.identity = this._userService.getIdentity();
        this.url = GLOBAL.url;
        this.user = this.identity;
    }

    ngOnInit(){
        console.log('user-edit component cargado.');
    }

    onSubmit(){
        console.log(this.user);
        this._userService.updateUser(this.user).subscribe(
            response =>{
                
                if (!response.user){
                    this.alertMessage = 'El usuario no se ha actualizado'
                } else {

                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById('#identity_name').innerHTML = this.user.name;

                    if (!this.filesToUpload){
                        // redireccion
                    } else {
                        this.makeFileRequest(GLOBAL.url + '/upload-image-user/' + this.user._id, [], this.filesToUpload)
                        .then((result: any) => {
                            this.user.image = result.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                            let imagePath = this.url + '/get-image-user/' + this.user.image;
                            document.getElementById("user-image").setAttribute('src', imagePath);
                            console.log(this.user.image);
                        })
                    }

                    this.alertMessage = "Datos modificados correctamente";
                }
            },
            error => {
                this.alertMessage = JSON.parse(error._body).message;

                if (error != null){
                console.log(error)
                }
            }
        );
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;  
    }

    makeFileRequest(url: string, params: Array<string>,files: Array<File>){
        var token = this.token;
        console.log(this.token);
        return new Promise(function(resolve, reject){
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append('image',files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4){
                    if (xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }   
                }

            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);   
            xhr.send(formData);
        })
    }
}