import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseContentType, Headers } from '@angular/http';
import {  saveFile } from './file-download-helper';
import {RequestOptions, Request, RequestMethod,Http,HttpModule} from '@angular/http';
import { environment } from '../../../environments/environment';

import { ApiService } from './api.service';
import { Job } from '../models';
import { map } from 'rxjs/operators';

@Injectable()
export class JobService {
  constructor (
    private apiService: ApiService,
    private http: Http,
  ) {}

  getActiveJob(jobID): Observable<Job> {
    return this.apiService.get('/jobads/1.json/')
      .pipe(map(
        data =>{console.log(data);
           return data;
           })      
      );
    
  } 
  
  getApprovalEmails(): Observable<Job> {
    return this.apiService.get('/user_contacts.json/')
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
          //console.log(data);
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

  shareJob(job): Observable<any> {
    debugger;
    return this.apiService
    .post('/share_ad/', job)
    .pipe(map(data => {
      return data;
    }));
  }

  update(job,id): Observable<Job> {
    return this.apiService
    .put('/jobads/'+id+'.json/', job)
    .pipe(map(data => {
      return data;
    }));
  }


  
  approve(job): Observable<any> {
    return this.apiService
    .post('/approve_ad/', job)
    .pipe(map(data => {
      return data;
    }));
  }

  finish(job): Observable<any> {
    return this.apiService
    .post('/finish_ad/', job)
    .pipe(map(data => {
      return data;
    }));
  }

  getJobList(): Observable<Job> {
    return this.apiService.get('/jobads.json/')
      .pipe(map(
        data =>{//console.log(data);
           return data;
           })      
      );
    
  } 

  getJobListById(id): Observable<Job> {
    return this.apiService.get('/jobads/'+id+'.json/')
      .pipe(map(
        data =>{
          //console.log(data);
           return data;
           })      
      );
    
  } 

  downloadFile(job) {
    const url = `${environment.api_url}`+`/download/jobad/`;
    const headers = new Headers();

   headers.append('Authorization', `Token `+localStorage.getItem("jwtToken"));

    const options = new RequestOptions(
      {
        responseType: ResponseContentType.Blob ,
        headers:headers
      });
      var jobid = job.jobad_id ;
    // Process the file downloaded
    this.http.post(url,job, options).subscribe(res => {
        //const fileName = "jobad_"+jobid+".docx";
        var date = new Date();
         var currentDate = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + "_" + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
         const fileName = "Job" + jobid + "_" + currentDate + ".docx";
        saveFile(res.blob(), fileName);
    });
}
}
