import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Job } from '../models';
import { map } from 'rxjs/operators';

@Injectable()
export class JobService {
  constructor (
    private apiService: ApiService
  ) {}

  getActiveJob(jobID): Observable<Job> {
    return this.apiService.get('/jobads/1.json/')
      .pipe(map(
        data =>{console.log(data);
           return data;
           })      
      );
    
  } 


  analyzeJob(job):Observable<Job> {
    return this.apiService.post('/analyze_ad/',job)
      .pipe(map(
        data =>{
          console.log(data);
           return data;
           })      
      );
    
  } 

  create(job): Observable<Job> {
    return this.apiService
    .post('/jobads.json/', job)
    .pipe(map(data => {
      return data;
    }));
  }

  shareJob(job): Observable<Job> {
    debugger;
    return this.apiService
    .post('/share_ad/', job)
    .pipe(map(data => {
      return data;
    }));
  }

  update(job): Observable<Job> {
    return this.apiService
    .put('/jobads/1.json/', job)
    .pipe(map(data => {
      return data;
    }));
  }


  
  approve(job): Observable<Job> {
    return this.apiService
    .put('/jobads/1.json/', job)
    .pipe(map(data => {
      return data;
    }));
  }

  

}
