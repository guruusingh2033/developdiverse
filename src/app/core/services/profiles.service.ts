import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Profile } from '../models';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfilesService {
  constructor (
    private apiService: ApiService
  ) {}

  get(): Observable<Profile> {
    debugger;
    return this.apiService.get('/user_info.json/')
      .pipe(map(
        data =>{console.log(data);
          debugger;
           return data;
           })      
      );
    
  }

    
  update(profile): Observable<Profile> {
    return this.apiService
    .put('/user_info.json/', profile)
    .pipe(map(data => {
      return data;
    }));
  }

  follow(username: string): Observable<Profile> {
    return this.apiService.post('/profiles/' + username + '/follow');
  }

  unfollow(username: string): Observable<Profile> {
    return this.apiService.delete('/profiles/' + username + '/follow');
  }

}
