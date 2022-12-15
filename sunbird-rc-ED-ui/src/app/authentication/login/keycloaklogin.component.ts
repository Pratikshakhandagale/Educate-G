import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-keycloaklogin',
  templateUrl: './keycloaklogin.component.html',
  styleUrls: ['./keycloaklogin.component.css'],
})
export class KeycloakloginComponent implements OnInit {
  user: any;
  entity: string;
  profileUrl: string = '';
  constructor(
    public keycloakService: KeycloakService,
    public router: Router,
    private config: AppConfig
  ) {}

  ngOnInit(): void {
    this.keycloakService.loadUserProfile().then((res) => {
      this.entity = res['attributes'].entity[0];
      if (
        res['attributes'].hasOwnProperty('locale') &&
        res['attributes'].locale.length
      ) {
        localStorage.setItem('setLanguage', res['attributes'].locale[0]);
      }
    });
    this.user = this.keycloakService.getUsername();
    this.keycloakService.getToken().then((token) => {
      localStorage.setItem('token', token);
      localStorage.setItem(
        'LoggedInKeyclockID',
        JSON.parse(atob(token.split('.')[1])).sub
      );
      localStorage.setItem('loggedInUser', this.user);
      if (
        this.config.getEnv('appType') &&
        this.config.getEnv('appType') === 'digital_wallet'
      ) {
        this.profileUrl = this.entity + '/documents';
      } else {
        this.profileUrl = '/profile/' + this.entity;
      }
      this.router.navigate([this.profileUrl]);
    });
  }
}
