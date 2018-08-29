import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { User, UserService,Profile,ProfilesService,JwtService } from '../core';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs:any;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private profileService:ProfilesService,
   private spinner: NgxSpinnerService,
   private jwtService:JwtService

  ) {
   
  }

  ngOnInit() {
   this.faqs = [
       {
        ques:"1) Why is my word highlighted in blue?",
        ans:"Blue words are considered to be masculine-like words. These words are more attractive to male applicants than female applicants. They can discourage female applicants from applying to your job posts. "
       },
       {
        ques:"2) Why is my word highlighted in pink?",
        ans:"Pink words are considered to be feminine-like words. These words are more attractive to female applicants than male applicants. They do not discourage male applicants as much as male words do to female applicants."
       },
       {
           ques:"3) What is the DD score? ",
           ans:"This score represents the level of neutralization of your job ad. The score has been established using as reference the % of words shown that affect the applicant’s job appeal in research-based articles to . For a value of 60 or below the job is considered very biased, between 61-70 the job is considered quite biased, between 71-80 the job is considered low biased, between 81-99 the job is considered gender-neutral and a value of 100 represents a fully gender-neutral job ad.  Our recommendation is to have a DD score of 80 or above. This score can be increased by replacing gendered words/phrases by the neutral alternatives proposed by this tool."
       },
       {
            ques:"4) How can I write a job ad? ",
            ans:"You can either click in the text box or click ”New” on the icon __. Then, you can either type or copy the text in the big white box."
       },
     
       {
            ques:"5) How can I neutralize my job ad? ",
            ans:"Your job ad is being analyzed constantly for biased words. Once a word is detected, it is highlighted in either pink or blue color. Then, if you hover above the word, you will see a list of neutral alternative words to your biased ones. You can then select the one that you prefer. The DD score and the Gender wording will be updated accordingly.Please look at questions number 1 & 2 for further explanations on the colors. "
       },
        {
            ques:"6) How can I get my job ad reviewed by a colleague (share functionality)?",
            ans:"You have to press the button “Share” - shown at the top-left of the screen – and then enter your colleagues’ email address. Your colleague will then receive a notification by email."

       },{
           ques: "7) Where can I find all my job ads?",
           ans:"You can find them by clicking ”Job listing” on the icon __. You can also get to your job listing by clicking our logo at the top of the screen."
       }
   ];
  }



}