import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'Musify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public url: string;
  public errorMessage;
  public alertRegister;

  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.url = GLOBAL.url;
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    console.log(this.identity, this.token);
  }

  public onSubmit(){

    // Conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        this.identity = response.user;

        if (!this.identity._id){
          alert('El usuario no esta correctamente identificado')
        } else {
          // crear elemento en ls
          localStorage.setItem('identity', JSON.stringify(this.identity))

          // Conseguir el token para enviarlo en cada request
          this._userService.signup(this.user, 'true').subscribe(
            response => {

              this.token = response.token;

              if (this.token.length == 0){
                alert('El token no se ha generado')
              } else {
                localStorage.setItem('token', JSON.stringify(this.token))
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              this.errorMessage = JSON.parse(error._body).message;

              if (error != null){
                console.log(error)
              }
            }
          );
        }
      },
      error => {
        this.errorMessage = JSON.parse(error._body).message;

        if (error != null){
          console.log(error)
        }
      }
    );
  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      response => {
        this.user_register = response.user;

        if (!this.user_register._id){
          this.alertRegister = 'Error al registrarse'
        } else {
          this.alertRegister = 'Registro satisfactorio!'
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        //this.errorMessage = JSON.parse(error._body).message;

        if (error != null){
          console.log(error)
        }
      }
    );
  }

  


  logout(){
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      this.identity = null;
      this.token = null;
      this._router.navigate(['/'])
  }
}
 