import { Component, OnInit,TemplateRef ,ElementRef} from '@angular/core';
import { Router,Route, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticleListConfig,JobService,Job,UserService } from '../core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3:BsModalRef;
  openScreen:boolean=true;
  state:string='';

  authType: String = '';
  title: String = '';
  errors: Object = {};
  isSubmitting = false;
  homeForm: FormGroup;
  submit: boolean = false;
  alerts: any;
  message: string = '';

  ad_body: any;
  serviceReply: any;
  options: any;
  originalContent: any;
  noHtmlContent: any;
  isAuthenticated: boolean;
  colorObj:{}={male:"blue",female:"pink",corrected:"green" };

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private jobService:JobService

  ) {
    this.homeForm = this.fb.group({
      'ad_title': ['', Validators.required],
      'ad_body': ['', Validators.required],
      'company':['', Validators.required],
      'city':['', Validators.required],
      'country':['', Validators.required],
      'department':['', Validators.required],
    });


  }

  get f() { return this.homeForm.controls; }

  ngOnInit() {

    

   this.state=this.route.snapshot.params.id;
    if(this.state == 'editor'){
      this.openScreen = false;
    }
   this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;

        // set the article list accordingly
       
      }
    );

    this.ad_body = "Our company is looking for an expert negotiator. Aggressiveness is a required trait, but sympathy is important as well.";
    //this.ad_body =`Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over <span id='content' style='color:green' (click)='call()'>content</span>. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> is mostly a part of a Latin text by the classical author and philosopher Cicero. Its words and letters have been changed by addition or removal, so to deliberately render its <span id='content' style='color:green' (click)='call()'>content</span> nonsensical; it's not genuine, correct, or comprehensible Latin anymore. While lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span>'s still resembles classical Latin, it actually has no meaning whatsoever. As Cicero's text doesn't contain the letters K, W, or Z, alien to latin, these, and others are often inserted randomly to mimic the typographic appearence of European languages, as are digraphs not to be found in the original.  In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual <span id='content' style='color:green' (click)='call()'>content</span> still not being ready. Think of a news blog that's filled with <span id='content' style='color:green' (click)='call()'>content</span> hourly on the day of going live. However, reviewers tend to be distracted by comprehensible <span id='content' style='color:green' (click)='call()'>content</span>, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements. Besides, random text risks to be unintendedly humorous or offensive, an unacceptable risk in corporate environments. Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> and its many variants have been employed since the early 1960ies, and quite likely since the sixteenth century.` ; 
    var input = document.getElementById('myInput');
    this.serviceReply =  {
      "ok": true,
      "id": 29,
      "biases": {
        "dd_score": 18.13,
        "biases": [{
            "key": "aggressiveness",
            "suggestions": [{
              "alternative_phrase_id": 4,
              "alternative_phrase": "forwardness",
              "biased_phrase_id": 4,
              "selected_counter": 0,
              "biased_towards_female": false
            }]
          },
          {
            "key": "sympathy",
            "suggestions": [{
                "alternative_phrase_id": 5,
                "alternative_phrase": "respect",
                "biased_phrase_id": 5,
                "selected_counter": 0,
                "biased_towards_female": true
              },
              {
                "alternative_phrase_id": 6,
                "alternative_phrase": "friendliness",
                "biased_phrase_id": 5,
                "selected_counter": 0,
                "biased_towards_female": true
              }
            ]
          }
        ]
      },
      "percentages": {
        "num_total_words": 21,
        "num_biased_male_words": 1,
        "num_biased_female_words": 2,
        "perc_biased_male_words": 4.76,
        "perc_biased_female_words": 9.52
      }
    };
    console.log(this.serviceReply.biases.biases[0].key);
  }

  loadJobEditor(){
    this.openScreen =false;
    this.router.navigateByUrl('/dashboard/editor');
  }

  ngAfterViewInit(){
    if(this.openScreen){
    let element:HTMLElement =  document.getElementById("modal") as HTMLElement;
    element.click(); 
    }

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModal2(template: TemplateRef<any>) {
    this.closeFirstModal();
    this.modalRef = this.modalService.show(template);
  }

  openModal3(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }


  /** from old  functionality   */

  dropdownSelect() {
    var selectBox =  this.elRef.nativeElement.querySelectorAll('select');
    for(var i=0;i<selectBox.length;i++){
      selectBox[i].addEventListener('change', this.onClick.bind(this));
     console.log("binded");
    }
   }
 
 
   magic() {
     console.log(this.ad_body);
   }
 
 
   getNoHtmlContent() {
     var data = document.querySelector(".ngx-editor-textarea").innerHTML;
     console.log(data);
     // var html=this.ad_body;
     var dom = document.createElement("DIV");
     dom.innerHTML = data;
     var plain_text = (dom.textContent || dom.innerText);
     return this.noHtmlContent = plain_text;
 
   }
 
   clearOptionWithoutSelectedTag() {
     var selectBoxes = document.querySelectorAll(".form");
     console.log(selectBoxes);
     Object.keys(selectBoxes).map(function (key) {
       console.log(selectBoxes[key].options.length);
       for (var i = 0; i < selectBoxes[key].options.length; i++) {
         if (selectBoxes[key].options[i].index != selectBoxes[key].selectedIndex)
           selectBoxes[key].remove(i);
       }
     })
   }
 
   onKeydown(event) {

     // console.log(event);
     // console.log(this.ad_body);
     if (event.keyCode == 190) {

      // this.jobService
      // .analyzeJob(updatePassForm)
      // .subscribe(
      //   updatedUser =>       {
      //   this.isSubmitting = false;
        
      //   this.router.navigateByUrl('/profile')},
      //   err => {
      //     if(typeof(err) == "object")
      //     {         
      //      this.errors = err.error_message;
      //     }
      //     else{
      //       this.errors = err;
  
      //     }

      //     this.isSubmitting = false;
      //   }
      // );

      //clear and fetch new data
        this.clearOptionWithoutSelectedTag();
        this.ad_body = this.getNoHtmlContent();
 
       //your code
       console.log("Spacebar fired");
       var n = this.ad_body.includes(".");
       if (n) {
         var testing = this.ad_body;
         debugger;
         for (var i = 0; i < this.serviceReply.biases.biases.length; i++) {
           var test = this.serviceReply.biases.biases[i].key;
           if (testing.includes(test)) {
             // var re = new RegExp(test, 'gi');
             var re = new RegExp(test + '(?!([^ ]+)?>)', 'gi');
             //   var optionregEx = '^(<option value="([^"]+).*?(?:selected="selected")?.*)$';
             // var matchIfOption =  new RegExp("<option>"+test+"</option>");
             //   var testRegex =  matchIfOption.test(testing);
            //  var suggestions = this.serviceReply[i].suggestion;
            //  var suggestionToHtml = suggestions.map(function (data) {
            //    return '<p>' + data + '</p>';
            //  });
            //  var implodeSuggestion = suggestionToHtml.join(" ");
             //  var replaceValue = '<span class="dropdown">hello <div class="dropdown-content"><p>Bye World!</p></div></span> ';
             var substrVal =  test.substring(0,3);
             var color;
             if(this.serviceReply.biases.biases[i].key) 
             var replaceValue =
               "<select  id='" +substrVal+i + "' style='color:"
               + this.serviceReply.biases.biases[i].key +
               "' class='form'> <option>" + test +
               "</option><option><strike>tests</strike></option></select> ";
             //  if(testRegex == false){
             testing = testing.replace(re, replaceValue);
             //}
 
           }
         }
         this.ad_body = testing;
 
         console.log(this.ad_body);
 
       }
 
     }
   }
 
 
   onClick(data) {
     console.log(data)
 
     console.log("fire");
     var selectBoxes = document.querySelectorAll(".form-control");
     console.log(selectBoxes);
     Object.keys(selectBoxes).map(function (key) {
       console.log(selectBoxes[key].selectedIndex);
       selectBoxes[key].setAttribute("class","true");
     //   for (var i = 0; i < selectBoxes[key].options.length; i++) {
     //     selectBoxes[key].options[i].setAttribute
     //   //   if (selectBoxes[key].options[i].index != selectBoxes[key].selectedIndex)
     //   //     selectBoxes[key].remove(i);
     //   //  }
      })
   }
 
  /** end from old functionlit */


}
