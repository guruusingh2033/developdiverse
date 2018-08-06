import { Component, OnInit, TemplateRef, ElementRef, OnDestroy } from '@angular/core';
import { Router, Route, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticleListConfig, JobService, Job, UserService } from '../core';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import 'rxjs/add/operator/filter';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  openScreen: boolean = true;
  state: string = '';
  updateData: any;

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
  noHtmlContent: any;
  isAuthenticated: boolean;
  colorObj: {} = { male: "blue", female: "pink", corrected: "green" };

  showDropdown: boolean = true;
  dropdownContent: any;
  email: string;
  dialogErr: string = "";
  actionState: string = "add";
  isOwner: boolean = false;
  loaderMsg: string = "Saving...";
  createdJobId: any;
  dialogRemember: any = "";
  navigationSubscription;

  customSelected: string;
  statesComplex: any[] = [{}];
  jobType = ["Draft", "Shared", "Approved", "Finished"];
  updatedData: any;
  isApproved: boolean = false;
  isShared: boolean = false;
  isDraft: boolean = false;
  isFinished: boolean = false;
  selectedJobStatus: any;
  templateMsg: String;

  // statesComplex: any[] = [
  //   { id: 1, name: 'Alabama', region: 'South' },
  //   { id: 2, name: 'Alaska', region: 'West' },
  //   { id: 3, name: 'Arizona', region: 'West' },
  //   { id: 4, name: 'Arkansas', region: 'South' },
  //   { id: 5, name: 'California', region: 'West' },
  //   { id: 6, name: 'Colorado', region: 'West' },
  //   { id: 7, name: 'Connecticut', region: 'Northeast' },
  //   { id: 8, name: 'Delaware', region: 'South' },
  //   { id: 9, name: 'Florida', region: 'South' },
  //   { id: 10, name: 'Georgia', region: 'South' },
  //   { id: 11, name: 'Hawaii', region: 'West' },
  //   { id: 12, name: 'Idaho', region: 'West' },
  //   { id: 13, name: 'Illinois', region: 'Midwest' },
  //   { id: 14, name: 'Indiana', region: 'Midwest' },
  //   { id: 15, name: 'Iowa', region: 'Midwest' },
  //   { id: 16, name: 'Kansas', region: 'Midwest' },
  //   { id: 17, name: 'Kentucky', region: 'South' },
  //   { id: 18, name: 'Louisiana', region: 'South' },
  //   { id: 19, name: 'Maine', region: 'Northeast' },
  //   { id: 21, name: 'Maryland', region: 'South' },
  //   { id: 22, name: 'Massachusetts', region: 'Northeast' },
  //   { id: 23, name: 'Michigan', region: 'Midwest' },
  //   { id: 24, name: 'Minnesota', region: 'Midwest' },
  //   { id: 25, name: 'Mississippi', region: 'South' },
  //   { id: 26, name: 'Missouri', region: 'Midwest' },
  //   { id: 27, name: 'Montana', region: 'West' },
  //   { id: 28, name: 'Nebraska', region: 'Midwest' },
  //   { id: 29, name: 'Nevada', region: 'West' },
  //   { id: 30, name: 'New Hampshire', region: 'Northeast' },
  //   { id: 31, name: 'New Jersey', region: 'Northeast' },
  //   { id: 32, name: 'New Mexico', region: 'West' },
  //   { id: 33, name: 'New York', region: 'Northeast' },
  //   { id: 34, name: 'North Dakota', region: 'Midwest' },
  //   { id: 35, name: 'North Carolina', region: 'South' },
  //   { id: 36, name: 'Ohio', region: 'Midwest' },
  //   { id: 37, name: 'Oklahoma', region: 'South' },
  //   { id: 38, name: 'Oregon', region: 'West' },
  //   { id: 39, name: 'Pennsylvania', region: 'Northeast' },
  //   { id: 40, name: 'Rhode Island', region: 'Northeast' },
  //   { id: 41, name: 'South Carolina', region: 'South' },
  //   { id: 42, name: 'South Dakota', region: 'Midwest' },
  //   { id: 43, name: 'Tennessee', region: 'South' },
  //   { id: 44, name: 'Texas', region: 'South' },
  //   { id: 45, name: 'Utah', region: 'West' },
  //   { id: 46, name: 'Vermont', region: 'Northeast' },
  //   { id: 47, name: 'Virginia', region: 'South' },
  //   { id: 48, name: 'Washington', region: 'South' },
  //   { id: 49, name: 'West Virginia', region: 'South' },
  //   { id: 50, name: 'Wisconsin', region: 'Midwest' },
  //   { id: 51, name: 'Wyoming', region: 'West' }
  // ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private jobService: JobService,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef


  ) {

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        //   this.initialiseInvites();
        this.homeForm.reset({});
        this.createdJobId = false;
        this.updateData = false;
        this.isApproved = false;
        this.isDraft = false;
        this.isShared = false;
        this.isFinished = false;
      }
    });
    this.homeForm = this.fb.group({
      'ad_title': ['', Validators.required],
      'ad_body': ['', Validators.required],
      'company': ['', Validators.required],
      'city': ['', Validators.required],
      'country': ['', Validators.required],
      'department': ['', Validators.required],
    });



  }

  get f() { return this.homeForm.controls; }

  ngOnInit() {

    // console.log("isowner" + this.isOwner);
    this.dropdownContent = `<div class="dropdown" contenteditable="false">
    <ul class="dropdown-select">
      <li class="drop"><a>Data</a></li>
      <li class="drop" id=""><a>Data1</a></li>
      <li class="drop" id=""><a>Data2</a></li>
      <li class="drop" id=""><a>Data3</a></li>
    </ul>
    </div>`;
    this.alerts = [];

    var dropdown = this.dropdownContent;
    //   var dropdownContent = 
    // `<div class="dropdown" contenteditable="false">
    //   <ul>
    //     <li id=""><a>Data</a></li>
    //     <li id=""><a>Data1</a></li>o
    //     <li id=""><a>Data2</a></li>
    //     <li id=""><a>Data3</a></li>
    //   </ul>
    //   </div>`;


    $(document).ready(function () {
      $(".dropdown").hide();
      $(".openDrp").click(function () {
        // alert("hi");
        $(".dropdown").toggle();

        ////   $(this).append(dropdown);


        // var selectBox = document.querySelectorAll('.drop');
        // console.log(selectBox);
        // for(var i=0;i<selectBox.length;i++){
        //   console.log(selectBox[i]);
        // selectBox[i].addEventListener('click',function(){

        // },false);
        //  console.log("binded");
        // }
      });

      $(".drop").click(function () {
        //alert("hello");
        //  /     $(".dropdown").toggle();

      });

    });





    this.state = this.route.snapshot.params.id;
    this.route.queryParams
      .filter(params => params.data)
      .subscribe(params => {
        //  console.log(params); // {order: "popular"}

        this.updateData = params.data;
        this.selectedJobStatus = params.status;
        //   console.log(this.updateData); // popular
      });

    if (this.updateData) {
      this.actionState = "update";
      this.loaderMsg = "Loading..";

      this.spinner.show();
      this.jobService.getJobListById(this.updateData)
        .subscribe(
          jobList => {
            //response
            console.log(jobList)
            this.spinner.hide();
            this.updatedData = jobList;
            this.statusUpdate();
            this.isOwner = jobList.is_owner;
            //  console.log(this.isOwner);
            this.homeForm.patchValue(jobList);

          },
          err => {
            //  debugger;

          }
        );

    }

    if (this.state == 'editor') {
      this.openScreen = false;
    }
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;

        // set the article list accordingly

      }
    );

    this.ad_body = ``;

    //  this.ad_body =`Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over <span id='content' style='color:green' (click)='call()'>content</span>. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> is mostly a part of a Latin text by the classical author and philosopher Cicero. Its words and letters have been changed by addition or removal, so to deliberately render its <span id='content' style='color:green' (click)='call()'>content</span> nonsensical; it's not genuine, correct, or comprehensible Latin anymore. While lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span>'s still resembles classical Latin, it actually has no meaning whatsoever. As Cicero's text doesn't contain the letters K, W, or Z, alien to latin, these, and others are often inserted randomly to mimic the typographic appearence of European languages, as are digraphs not to be found in the original.  In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual <span id='content' style='color:green' (click)='call()'>content</span> still not being ready. Think of a news blog that's filled with <span id='content' style='color:green' (click)='call()'>content</span> hourly on the day of going live. However, reviewers tend to be distracted by comprehensible <span id='content' style='color:green' (click)='call()'>content</span>, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements. Besides, random text risks to be unintendedly humorous or offensive, an unacceptable risk in corporate environments. Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> and its many variants have been employed since the early 1960ies, and quite likely since the sixteenth century.` ; 
    var input = document.getElementById('myInput');
    this.serviceReply = {
      "biases": {
        "dd_score": 50.82,
        "bias_analysis": {
          "sentences": [
            {
              "key": "Aggressiveness is a required trait, but sympathy is important as well.",
              "biases": [
                {
                  "key": "sympathy",
                  "suggestions": [
                    {
                      "alternative_phrase_id": 2910,
                      "alternative_phrase": "respect",
                      "biased_phrase_id": 961,
                      "selected_counter": 0,
                      "biased_towards_female": true
                    },
                    {
                      "alternative_phrase_id": 2911,
                      "alternative_phrase": "personability",
                      "biased_phrase_id": 961,
                      "selected_counter": 0,
                      "biased_towards_female": true
                    },
                    {
                      "alternative_phrase_id": 2912,
                      "alternative_phrase": "friendliness",
                      "biased_phrase_id": 961,
                      "selected_counter": 0,
                      "biased_towards_female": true
                    },
                    {
                      "alternative_phrase_id": 2913,
                      "alternative_phrase": "openness",
                      "biased_phrase_id": 961,
                      "selected_counter": 0,
                      "biased_towards_female": true
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      "percentages": {
        "num_total_words": 19,
        "num_biased_male_words": 0,
        "num_biased_female_words": 4,
        "perc_biased_male_words": 0,
        "perc_biased_female_words": 21.05
      }
    }
    // console.log(this.serviceReply.biases.biases[0].key);
    this.getApprovalEmail();
  }

  statusUpdate() {
    console.log("----------");
    console.log(this.updateData);

    if (this.updateData) {
      console.log(this.selectedJobStatus);

      if (this.selectedJobStatus == 0) {
        this.isDraft = true;
      }
      else if (this.selectedJobStatus == 1) {
        this.isDraft = true;
        this.isShared = true;

      }
      else if (this.selectedJobStatus == 2) {
        this.isDraft = true;
        this.isShared = true;
        this.isApproved = true;
      }
      else if (this.selectedJobStatus == 3) {
        this.isDraft = true;
        this.isShared = true;
        this.isApproved = true;
        this.isFinished = true;
      }
    }
  }

  loadJobEditor() {
    this.openScreen = false;
    this.router.navigateByUrl('/dashboard/editor');
  }

  ngAfterViewInit() {
    if (this.openScreen) {
      let element: HTMLElement = document.getElementById("modal") as HTMLElement;
      element.click();
    }

  }

  ngAfterViewChecked() {
    this.dialogRemember = "";
    this.cdRef.detectChanges();
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModal2(template: TemplateRef<any>) {
    this.spinner.show();

    if (!this.updateData) {
      // console.log(this.createdJobId);
      debugger;
      if (!this.createdJobId) {
        var res = this.createJob()
          .then((res: any) => {
            //   console.log(res);
            if (res.status == "true") {
              this.spinner.hide();
              debugger;
              this.templateMsg = "A notification has been sent to your Colleague’s email";
              this.closeFirstModal();
              this.modalRef = this.modalService.show(template);
              this.router.navigateByUrl('/joblisting');

            }
            else {
              debugger;
              this.spinner.hide();
              // this.createdJobId = res.jobId;

              if (typeof (res.data) == "object") {
                this.createdJobId = res.jobId;

                this.dialogErr = res.data.error_message;
                this.alerts.push({
                  type: 'danger',
                  msg: this.dialogErr,
                  timeout: 3000
                });
              }
              else {
                //this.dialogErr = res.data;
                this.templateMsg = "A notification has been sent to your Colleague’s email";

                this.closeFirstModal();
                this.modalRef = this.modalService.show(template);
                this.router.navigateByUrl('/joblisting');

              }
            }
          })
          .catch((err) => {
            // console.log(err); 
            this.dialogErr = err
          });
      }
      else {

        this.shareJob(this.createdJobId)
          .then((data: any) => {
            this.spinner.hide();
            //   console.log(data);
            if (data.status) {
              this.closeFirstModal();
              this.templateMsg = "A notification has been sent to your Colleague’s email";

              this.modalRef = this.modalService.show(template);
              this.router.navigateByUrl('/joblisting');

            }
            else {
              this.alerts.push({
                type: 'danger',
                msg: data.data.error_message,
                timeout: 3000
              });
            }

          })
          .catch((err) => {
            this.alerts.push({
              type: 'danger',
              msg: err.error_message,
              timeout: 3000
            });
          });
      }
    }
    else {

      this.shareJob(this.updateData)
        .then((data: any) => {
          this.spinner.hide();
          //   console.log(data);
          if (data.status) {
            this.closeFirstModal();
            this.templateMsg = "A notification has been sent to your Colleague’s email";

            this.modalRef = this.modalService.show(template);
            this.router.navigateByUrl('/joblisting');

          }
          else {
            this.alerts.push({
              type: 'danger',
              msg: data.data.error_message,
              timeout: 3000
            });
          }

        })
        .catch((err) => {
          this.alerts.push({
            type: 'danger',
            msg: err.error_message,
            timeout: 3000
          });
        });



    }
  }

  openModal3(template: TemplateRef<any>) {
    if (localStorage.getItem("dialogOff") != "true") {
      this.modalRef = this.modalService.show(template);
    }
  }


  closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;

  }

  displayButton(button) {
    if (button == "create") {
      return (this.isOwner && !this.isDraft) || !this.updateData;
    }
    else if (button == "share") {
      return this.isOwner && this.isDraft && !this.isShared;
    }
    else if (button == "approve") {
      return !this.isOwner && this.isShared && !this.isApproved;
    }
    else if (button == "finish") {
      return this.isApproved && this.isOwner && !this.isFinished;
    }
    else if (button == "finishread") {
      return !this.isOwner && this.isShared && this.isApproved && !this.isFinished;

    }
    else if (button == "finishr") {
      return this.isOwner && this.isShared && !this.isApproved;

    }

  }
  approve(template) {
    this.spinner.show();
    if (this.selectedJobStatus == 1) {

      var dataForm = {
        "ad_body": this.homeForm.value.ad_body,
        "ad_title": this.homeForm.value.ad_title,
        "department": this.homeForm.value.department,
        "city": this.homeForm.value.city,
        "country": this.homeForm.value.country
      };

      // this.updateJob(dataForm, this.updateData)
      //   .then((dataUpdate) => {
          // start of approve job
          this.jobService.approve({ jobad_id: this.updateData })
            .subscribe(
              jobList => {
                //response
                //  this.spinner.hide();
                console.log(jobList);
                this.spinner.hide();
                if (jobList.is_approved == true) {
                  this.router.navigateByUrl('/joblisting');
                }
                else {
                  this.spinner.hide();
                  this.templateMsg = "Unable To Approve Job :approve";
                  this.modalRef = this.modalService.show(template);

                }

                //  this.isOwner = !jobList.is_owner;
                //  console.log(this.isOwner);
                //   this.homeForm.patchValue(jobList);
              },
              err => {
                //  debugger;
                this.spinner.hide();
                this.templateMsg = "Unable To Approve Job : approve";

                this.modalRef = this.modalService.show(template);

              }
            );
          //end of approve job
        // })
        // .catch((err) => {
        //   this.spinner.hide();
        //   this.templateMsg = "Unable To Approve Job : update issue";

        //   this.modalRef = this.modalService.show(template);
        // })





    }


  }

  finish(template) {
    this.spinner.show();
    if (this.selectedJobStatus == 2) {
      this.jobService.finish({ jobad_id: this.updateData })
        .subscribe(
          jobList => {
            //response
            //  this.spinner.hide();
            console.log(jobList);
            this.spinner.hide();
            if (jobList.is_finished == true) {
              this.router.navigateByUrl('/joblisting');
            }
            else {
              this.spinner.hide();
              this.templateMsg = "Unable To Finish Job";
              this.modalRef = this.modalService.show(template);

            }

            //  this.isOwner = !jobList.is_owner;
            //  console.log(this.isOwner);
            //   this.homeForm.patchValue(jobList);
          },
          err => {
            //  debugger;
            this.spinner.hide();
            this.templateMsg = "Unable To Finish Job";

            this.modalRef = this.modalService.show(template);

          }
        );
    }


  }


  shareJobDirect(template) {
    this.spinner.show();

    var email = this.email;
    var shareJob = { jobad_id: this.updateData, recipient: email };

    this.jobService
      .shareJob(shareJob)
      .subscribe(
        sharedUser => {
          //response
          this.spinner.hide();
          this.router.navigateByUrl('/joblisting');


        },
        err => {
          //  debugger;
          this.spinner.hide();
          this.modalRef = this.modalService.show(template);

        }
      );

  }



  /** from old  functionality   */

  dropdownSelect() {
    var selectBox = this.elRef.nativeElement.querySelectorAll('select');
    // console.log(selectBox);
    for (var i = 0; i < selectBox.length; i++) {

      selectBox[i].addEventListener('change', this.onClick.bind(this));
      // console.log("binded");
    }
  }

  modelChanged(data) {
    // console.log("fire");
    this.dropdownSelect();

    // console.log(data);
  }
  magic() {
    // console.log(this.ad_body);
  }


  getNoHtmlContent() {
    var data = document.querySelector(".ngx-editor-textarea").innerHTML;
    // console.log(data);
    // var html=this.ad_body;
    var dom = document.createElement("DIV");
    dom.innerHTML = data;
    var plain_text = (dom.textContent || dom.innerText);
    return this.noHtmlContent = plain_text;

  }

  clearOptionWithoutSelectedTag() {
    var selectBoxes = document.querySelectorAll(".form-ele");
    //console.log(selectBoxes);
    Object.keys(selectBoxes).map(function (key) {
      //  console.log(selectBoxes[key].options.length);
      for (var i = 0; i < selectBoxes[key].options.length; i++) {
        if (selectBoxes[key].options[i].index != selectBoxes[key].selectedIndex)
          selectBoxes[key].remove(i);
      }
    })
  }

  setDialogState() {
    if (localStorage.getItem("dialogOff") == "true") {
      localStorage.setItem("dialogOff", "false");
    }
    else {
      localStorage.setItem("dialogOff", "true");

    }
  }

  onKeydown(event) {

    // console.log(event);
    // console.log(this.ad_body);
    if (event.keyCode == 190) {

      //   this.clearOptionWithoutSelectedTag();
      //  this.ad_body = this.getNoHtmlContent();
      // debugger;
      // var jobForm={
      //   jobad_title:this.homeForm.value.ad_title,
      //   jobad_body:this.ad_body
      // };
      //hit service
      // this.jobService
      // .analyzeJob(jobForm)
      // .subscribe(
      //   updatedJob => {
      //   console.log(updatedJob);
      //   this.serviceReply = updatedJob;
      //      //clear and fetch new data

      //   },
      //   err => {
      //    console.log(err)
      //   }
      // );
      //this.afterServiceProcess();

    }
  }

  onClick(data) {
    //  console.log("fire");
    //  console.log(data);

    //  console.log("fire");
    //  var selectBoxes = document.querySelectorAll(".form-control");
    //  console.log(selectBoxes);
    //  Object.keys(selectBoxes).map(function (key) {
    //    console.log(selectBoxes[key].selectedIndex);
    //    selectBoxes[key].setAttribute("class","true");
    //  //   for (var i = 0; i < selectBoxes[key].options.length; i++) {
    //  //     selectBoxes[key].options[i].setAttribute
    //  //   //   if (selectBoxes[key].options[i].index != selectBoxes[key].selectedIndex)
    //  //   //     selectBoxes[key].remove(i);
    //  //   //  }
    //   })
  }





  createJob() {
    return new Promise(resolve => {

      var dataForm = {
        "ad_body": this.homeForm.value.ad_body,
        "ad_title": this.homeForm.value.ad_title,
        "department": this.homeForm.value.department,
        "city": this.homeForm.value.city,
        "country": this.homeForm.value.country
      };
      this.jobService
        .create(dataForm)
        .subscribe(
          updatedUser => {
            //response
            this.isSubmitting = false;

            this.shareJob(updatedUser.id)
              .then((datax: any) => {
                debugger;

                if (datax.status) {
                  resolve({ status: true, data: datax.data, jobId: datax.jobId });
                }
                else {
                  resolve({ status: false, data: datax.data, jobId: datax.jobId });

                }
              })
              .catch((err) => {
                resolve({ status: false, data: err });
              });

          },
          err => {
            this.spinner.hide();
            // this.alerts.push({
            //   type: 'danger',
            //   msg: this.errors,
            //   timeout: 3000
            // });
            this.isSubmitting = false;
            resolve({ status: false, data: err });
          }
        );
    });
  }


  shareJob(id) {
    debugger;
    return new Promise(resolve => {
      var email = this.email;
      var shareJob: object = { jobad_id: id, recipient: email };

      this.jobService
        .shareJob(shareJob)
        .subscribe(
          sharedUser => {
            //response
            debugger;
            resolve({ status: true, data: sharedUser, jobId: id });

          },
          err => {
            //  debugger;
            resolve({ status: false, data: err, jobId: id });

          }
        );
    });

  }

  updateJob(formData, id) {
    debugger;
    return new Promise(resolve => {

      this.jobService
        .update(formData, id)
        .subscribe(
          updateJob => {
            //response
            debugger;
            resolve({ status: true, data: updateJob });

          },
          err => {
            //  debugger;
            resolve({ status: false, data: err, jobId: id });

          }
        );
    });

  }



  afterServiceProcess() {

    var index = 0;
    //your code
    // console.log("Spacebar fired");
    var lastTypedText: any = this.fetchLastTextTyped();
    var n = this.ad_body.includes(".");
    if (n) {
      var testing = lastTypedText;
      debugger;
      for (var i = 0; i < this.serviceReply.biases.bias_analysis.sentences[index].biases.length; i++) {
        var test = this.serviceReply.biases.bias_analysis.sentences[index].biases[i].key;
        if (testing.includes(test)) {
          // var re = new RegExp(test, 'gi');
          var re = new RegExp(test + '(?!([^ ]+)?>)', 'gi');
          //   var optionregEx = '^(<option value="([^"]+).*?(?:selected="selected")?.*)$';
          // var matchIfOption =  new RegExp("<option>"+test+"</option>");
          //   var testRegex =  matchIfOption.test(testing);
          // var suggestions = this.serviceReply.biases.bias_analysis.sentences[index].biases[i].suggestions;
          // var suggestionToHtml = suggestions.map(function (data) {
          //   return '<option>' + data.alternative_phrase + '</option>';
          // });
          // var implodeSuggestion = suggestionToHtml.join(" ");
          //  var replaceValue = '<span class="dropdown">hello <div class="dropdown-content"><p>Bye World!</p></div></span> ';
          var substrVal = test.substring(0, 3);
          var color;
          // if(this.serviceReply.biases.bias_analysis.sentences[index].biases[i].key) 
          var replaceValue =
            "<select  id='" + substrVal + i + "' style='color:"
            + this.serviceReply.biases.bias_analysis.sentences[index].biases[i].key +
            "' class='form-ele'> <option>" + test +
            "</option><option>test</option></select> ";
          //  if(testRegex == false){
          testing = testing.replace(re, replaceValue);
          // testing = testing.replace('.','');
          //}

        }
      }
      this.ad_body = this.buildJobContentAfterServiceCall(testing);

      ///  console.log(this.ad_body);

    }
  }

  /** end from old functionlit */
  //fetched last typed text
  fetchLastTextTyped() {
    var data = this.ad_body.split(".");
    var dataLength = data.length;
    var getLastIndex = dataLength - 1;
    // console.log(data);
    debugger;
    return data[getLastIndex] + '.';

  }

  //builds job Content
  buildJobContentAfterServiceCall(lastTypedText) {
    var data = this.ad_body.split(".");
    var dataLength = data.length;
    var getLastIndex = dataLength - 1;
    delete data[getLastIndex];
    return data.join(".") + lastTypedText;

  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  closeAllModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
    if (this.modalRef2) {
      this.modalRef2.hide();
      this.modalRef2 = null;
    }
    if (this.modalRef3) {
      this.modalRef3.hide();
      this.modalRef3 = null;
    }
  }

  getApprovalEmail() {
    this.jobService
      .getApprovalEmails()
      .subscribe(
        (sharedEmail: any) => {
          //response
          console.log(sharedEmail);
          this.statesComplex = sharedEmail.contacts;
        },
        err => {
          //  debugger;

        }
      );
  }

  ngOnDestroy() {
    //   console.log("desroyed called");
    // delete  this.updateData;
    this.closeAllModal();
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

  }
}


function fire(data) {
  //console.log(data);
  $(".dropdown").hide();
}
