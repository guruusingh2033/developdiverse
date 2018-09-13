import { Component, OnInit, TemplateRef, ElementRef, OnDestroy } from '@angular/core';
import { Router, Route, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticleListConfig, JobService, Job, UserService, ProfilesService } from '../core';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import 'rxjs/add/operator/filter';
import { ChangeDetectorRef } from '@angular/core';
import { timeout } from 'q';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  //properties describes the modal state
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  //choose to open editor/welcome page [now only editor ,state always false]
  openScreen: boolean = true;
  state: string = '';
  //choose  whether to update data
  updateData: any;
  //changes boolean status depending on whether for submitted or in progress.
  isSubmitting = false;
  // homeform  variable
  homeForm: FormGroup;
  //triggers alert
  alerts: any;
  //defines job body data
  ad_body: any;
  //stores serviceReply data
  serviceReply: any;
  isAuthenticated: boolean;
  //display/hide dropdown suggestion menu
  showDropdown: boolean = true;
  dropdownContent: any;
  //stores email of target 
  email: string;
  //shows error 
  dialogErr: string = "";
  //sets job  in add or edit mode
  actionState: string = "add";
  //check whether person logged in is job owner
  isOwner: boolean = false;
  //sets loader msg
  loaderMsg: string = "Saving...";
  //stores created job id
  createdJobId: any;
  //remembers dialog state
  dialogRemember: any;
  //navigation subscription
  navigationSubscription;

  statesComplex: any[] = [{}];
  //declared predefined job type data
  jobType = ["Draft", "Shared", "Approved", "Finished"];
  //stores update job data
  updatedData: any;
  // sets whether job is approved or not
  isApproved: boolean = false;
  // sets whether job is shared or not
  isShared: boolean = false;
  // sets whether job is drafted 
  isDraft: boolean = false;
  // sets whether job is finished
  isFinished: boolean = false;
  //selects job status code
  selectedJobStatus: any;
  //sets the message to be shown in dialog
  templateMsg: String;
  //sets the saving state[future use]
  savingStatus: String;
  //checks whether state is readonly
  isReadonly: boolean = false;
  //get current user data
  currentUser: any;
  //stores company data
  company: String;
  //stores % of different category
  percBiasedMaleWords = 0;
  percBiasedFemaleWords = 0;
  percBiasedEthinicityWords = 0;
  percBiasedAgeWords = 0;
  //stores dd score and status
  ddScore: any;
  ddScoreStatus: any;
  // stores the complete job body now 
  lastTypedText: string;
  lastPastedText: string;
  //checks whether the content is pasted
  isPasted: boolean = false;
  isReloadedData: boolean = false;
  //stored  job data
  newlyAddedSentence: any = "";
  //remember last job body build
  lastJobBody: any = "";
  // sores complete html job body
  completeJobBody: any = "";
  // records char pressed [might be usable in future]
  charPressed: string = "";
  //checks whetherservice call is completed
  serviceCallStatus: boolean = false;
  // set status flag when model changes
  hasModalChange: boolean = false;
  // sets wait interval
  waitInterval: number = 5000;
  //sets job editor class dynamically [to make editor readonly or not]
  editorClass: any = "";
  //sets dd score text
  ddScoreText: string = "";
  // sets previous position of caret
  prevPositionOfCaret: number;
  //record button click
  whetherButtonClicked:boolean=false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private jobService: JobService,
    private profileService: ProfilesService,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef


  ) {

    // listens for navigation changes
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        var newstate = this.route.queryParams;
        this.route.queryParams.subscribe(params => {
          if (Object.keys(params).length == 0) {
            this.updateData = false;
            this.actionState = "add";
          }
        });
        //fetches job data when the editor is in update mode
        if (this.actionState == "update" && this.updateData) {
          this.fetchJobDataById();
          ////debugger;
          // console.log("update entered");
          // console.log(this.ad_body);

        }
        else {
          // reset all data when navigated and editor is in add mode
          this.homeForm.reset({ company: this.company });
          this.createdJobId = false;
          this.updateData = false;
          this.isApproved = false;
          this.isDraft = false;
          this.isShared = false;
          this.isFinished = false;
          this.isReadonly = false;
          this.percBiasedMaleWords = 0;
          this.percBiasedFemaleWords = 0;
          this.percBiasedEthinicityWords = 0;
          this.percBiasedAgeWords = 0;
          this.ddScore = '';
          this.ddScoreStatus = '';
        }


      }
    });

    // form values 
    this.homeForm = this.fb.group({
      'ad_title': ['', Validators.required],
      'ad_body': ['', Validators.required],
      'company': ['', Validators.required],
      'city': ['', Validators.required],
      'country': ['', Validators.required],
      'department': ['', Validators.required],
    });



  }


  titleChange() {
    if (this.isReadonly == true || this.f.ad_title.errors) {
      this.editorClass = "readonly editors";
      $(".ngx-editor-textarea").blur();

    }
    else {
      this.editorClass = "editors";
    }
  }

  // adds class on editor conditionally whether to make editor readonly or not
  addClass() {
    if (this.isReadonly == true || this.f.ad_title.errors) {
      this.editorClass = "readonly editors";
      $(".ngx-editor-textarea").blur();
      return this.editorClass;
    }
    else {
      this.editorClass = "editors";
      return "editors";
    }
  }

  get f() { return this.homeForm.controls; }

  ngOnInit() {
    this.titleChange();
    this.openScreen = false;

    //get user data
    this.getUser();

   
    //make fields readonly according to status

    this.alerts = [];

    var dropdown = this.dropdownContent;

    $(document).ready(function () {
      $(".dropdown").hide();
      $(".ngx-editor-textarea").click(function () {
        $('.dropdown').hide();

      });
      $(".ngx-editor-textarea").change(function () {
        alert("ddfd")
      });
      $(".openDrp").mouseover(function () {

        $('.dropdown').hide();
        var attrID = $(this).attr('id');
        $($(this).closest('span').children('.dropdown')).toggle()

      });

      // event to b fired when suggestions are clicked.
      $(".drop").click(function () {

        var currentSelected = $(this).text();
        // console.log(currentSelected);
        var selectedId = $(this).parent();
        // console.log(selectedId);
        // console.log("find closest button");

        $(this).closest("span").parent("span").children("button").text(currentSelected);
        $(this).closest("span").parent("span").children("button").css('color', 'black');
        $(this).closest('span').toggle();

      });



    });
    
    //fetches url params
    this.fetchUrlParams();
    if (this.updateData) {
      this.actionState = "update";
      this.fetchJobDataById();
  
    }

 console.log(this.selectedJobStatus);

    if (this.state == 'editor') {
      this.openScreen = false;
    }
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;

      }
    );


    var input = document.getElementById('myInput');
    // fetches approval email
    this.getApprovalEmail();
  
    var waitInterval = this.waitInterval;
    //hit api and gets formatted new html job body after every specified seconds
    setInterval(function () {
      var serviceCallStatus = this.serviceCallStatus;
      var hasModalChange = this.hasModalChange;
      if (this.serviceCallStatus == false && this.hasModalChange) {
        //debugger;
        this.intervalJobProcess();
      }

    }.bind(this), waitInterval);

  }

  // this function is called by setInterval and its primarily called on every fresh interval run
  // fetched body text and send to process job service
  intervalJobProcess() {
    if (this.isReloadedData) {
      this.spinner.show();
    }
    this.hasModalChange = false;
    this.completeJobBody = document.querySelector(".ngx-editor-textarea").innerHTML;
    //this.completeJobBody = this.completeJobBody.replace(/(<p[^>]+?>|<p>)/img, "").replace(new RegExp('</p>', "gi"), "</br>").replace(new RegExp("&nbsp;", 'g'), '');
    this.completeJobBody = this.completeJobBody.replace(/(<p[^>]+?>|<p>)/img, "").replace(new RegExp('</p>', "gi"), "</br>").replace(new RegExp("&nbsp;", 'g'), ' ');

    document.querySelector(".ngx-editor-textarea").innerHTML = this.completeJobBody;

    if (this.completeJobBody != "") {
      // this.isPasted = false;
      // if (this.isPasted) {
      //   this.lastTypedText = this.fetchLastTextTyped();
      // }
      // else {
      //   this.lastTypedText = this.fetchLastTextTyped();

      // }
    
      this.processJobService();
    }

  }

// listens to every modal change.
  modelChanged(e) {
    //debugger;
    this.hasModalChange = true;
  }



  //function loads jquery whenever some analyze change happens
  loadingJquery() {
    var self = this;
    // console.log("loaded jquery....");
    $(document).ready(function () {

      $(".dropdown").hide();
      $(".openDrp").mouseover(function () {
        //debugger;
        // alert("hi");
        $('.dropdown').hide();

        var attrID = $(this).attr('id');
        $($(this).closest('span').children('.dropdown')).toggle()

      });

      $(".drop").click(function () {
        var currentSelected = $(this).text();
        // console.log(currentSelected);
        var selectedId = $(this).parent();
        var removeMainDiv = $(this).closest("span").parent("span").attr("id");
        var da = $(this).parent();
        $($(this).closest("span").parent("span")[0]).replaceWith(currentSelected);


        $(this).closest('span').toggle();

      });
      var prevPositionOfCaret: number;

      $(".ngx-editor-textarea").click(() => {
        $('.dropdown').hide();
        // prevPositionOfCaret = 0;
        prevPositionOfCaret = getCaretPosition();
        // console.log("last caret position" + prevPositionOfCaret);
        self.fillLastCaretPosition(prevPositionOfCaret);
        // console.log("last caret positio wn" + prevPositionOfCaret);

      });

      $(".ngx-editor-textarea").focus(() => {
        // prevPositionOfCaret =   getCaretPosition() ;
        // console.log("last caret position"+prevPositionOfCaret);
        // self.fillLastCaretPosition(prevPositionOfCaret);
        // console.log("last caret positio wn"+prevPositionOfCaret);
      });

    });



  }

  // fills last cursor/caret position
  fillLastCaretPosition(pos) {
    this.prevPositionOfCaret = pos;
  }

  

  //return biase level based on dd score
  getBiaseLevel(dd_score) {
    if (dd_score <= 60) {
      return this.ddScoreStatus = "High Biased";
    }
    else if (dd_score <= 90 && dd_score > 60) {
      return this.ddScoreStatus = "Medium Biased";
    }

    else if (dd_score > 90) {
      return this.ddScoreStatus = "Low Biased";
    }
    else {
      return this.ddScoreStatus = "";
    }
  }

  //fetches user data
  getUser() {
    this.profileService.get().subscribe(
      (userData) => {
        this.company = userData.company;
        this.homeForm.patchValue({ company: userData.company });

      }
    );
  }

  //fetches params data from url
  fetchUrlParams() {
    this.state = this.route.snapshot.params.id;
    this.route.queryParams
      .filter(params => params.data)
      .subscribe(params => {

        this.updateData = params.data;
//this.selectedJobStatus = params.status;
console.log("selected job status"+this.selectedJobStatus);
      });

  }


  //fetches job data by id
  fetchJobDataById() {
    this.loaderMsg = "Loading..";
    this.spinner.show();
    this.jobService.getJobListById(this.updateData)
      .subscribe(
        (jobList: any) => {        
            this.selectedJobStatus = jobList.status;

          //response
           console.log(jobList)
          this.spinner.hide();
          this.updatedData = jobList;
          this.statusUpdate();
          this.isOwner = jobList.is_owner;
          //  console.log(this.isOwner);
          this.homeForm.patchValue(jobList);
          this.ddScore = jobList.dd_score.toFixed(0);
          this.ddScoreText = jobList.dd_score_text;
          this.percBiasedFemaleWords = jobList.female_phrases_percentage;
          this.analyzeAfterServicePopulate(jobList);
        },
        err => {

        }
      );
  }


  //for hide /show selection of different buttons such as draft/share/finish/approve/
  statusUpdate() {
    console.log("enetered status update");
    console.log(this.selectedJobStatus);
    if (this.updateData) {

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
        // this.isReadonly = true;
      }
    }
  }

  //loads job editor data
  loadJobEditor() {
    this.openScreen = false;
    this.router.navigateByUrl('/dashboard/editor');
  }


  ngAfterViewInit() {
    // if (this.openScreen) {
    let element: HTMLElement = document.getElementById("modal") as HTMLElement;
    element.click();
    //   }
    this.titleChange();
    console.log("view initiale");

  }


  ngAfterViewChecked() {
    this.dialogRemember = "";
    this.cdRef.detectChanges();
  }

  //opens dialog  modal
  openModal(template: TemplateRef<any>) {
    this.whetherButtonClicked = true;
    this.modalRef = this.modalService.show(template);


  }

  //open dialog status notifiction modal & save /update data ,this is called on "Done" click
  openModal2(template: TemplateRef<any>) {
    this.spinner.show();
    // if form is not in update state
    if (!this.updateData) {
      // if job id is not set in the url
      if (!this.createdJobId) {
        // creates a new  job
        var res = this.createJob()
          .then((res: any) => {
            if (res.status == true) {
              this.spinner.hide();
              this.templateMsg = "A notification has been sent to your Colleague’s email";
              this.closeFirstModal();
              this.modalRef = this.modalService.show(template);
              this.router.navigateByUrl('/joblisting');

            }
            else {
              this.spinner.hide();
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
                this.templateMsg = "A notification has been sent to your Colleague’s email";

                this.closeFirstModal();
                this.modalRef = this.modalService.show(template);
                this.router.navigateByUrl('/joblisting');

              }
            }
          })
          .catch((err) => {
            this.dialogErr = err
          });
      }
      else {
        // shares a job if already created 
        this.shareJob(this.createdJobId)
          .then((data: any) => {
            this.spinner.hide();
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
      // removes html tags that plays role in job suggestions
      this.clearOptionWithoutSelectedTag();
      // gets final html content body without suggestion tags
      var bodyData = this.getNoHtmlContentBody();
      bodyData = bodyData.replace(/ \./g, '.');

      var dataForm = {
        "ad_body": bodyData,
        "ad_title": this.homeForm.value.ad_title,
        "department": this.homeForm.value.department,
        "city": this.homeForm.value.city,
        "country": this.homeForm.value.country
      };

      // updates a job
      this.updateJob(dataForm, this.updateData)
        .then((updatedJobData) => {
          this.shareJob(this.updateData)
            .then((data: any) => {
              this.spinner.hide();
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


        })
        .catch((err) => {
          this.alerts.push({
            type: 'danger',
            msg: err.data.error_message,
            timeout: 3000
          });
        });


    }
  }

  //opens welcome modal
  openModal3(template: TemplateRef<any>) {
    if (localStorage.getItem("dialogOff") != "true") {
      // this.modalRef = this.modalService.show(template);
      localStorage.setItem("dialogOff", "true");
    }
  }

  //closes recently open modal
  closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;

  }


  //decides which button to display depending upon state of job
  displayButton(button) {
    if (button == "create") {
      return (this.isOwner && !this.isDraft) || !this.updateData;
    }
    else if (button == "share") {
      if (!this.isOwner && this.isDraft && !this.isShared) {
        this.isReadonly = true;
      }
      return this.isOwner && this.isDraft && !this.isShared;
    }
    else if (button == "approve") {
      return !this.isOwner && this.isShared && !this.isApproved;
    }
    else if (button == "finish") {
      if (this.isApproved && this.isOwner && !this.isFinished) {
        //this.isReadonly = true;

      }
      return !this.isShared && this.isDraft && this.isOwner && !this.isFinished;
    }
    else if (button == "ownerfinish") {
      return this.isApproved && this.isOwner && !this.isFinished;

    }
    else if (button == "finishread") {
      if (!this.isOwner && this.isShared && this.isApproved && !this.isFinished) {
        this.isReadonly = true;
      }
      return !this.isOwner && this.isShared && this.isApproved && !this.isFinished;

    }
    else if (button == "finishr") {
      if (this.isOwner && this.isShared && !this.isApproved) {
        this.isReadonly = true;
      }
      return this.isOwner && this.isShared && !this.isApproved;

    }


  }


  //approves a job
  approve(template) {
    this.whetherButtonClicked = true;

    this.spinner.show();
    // 
    if (this.selectedJobStatus == 1) {
      this.clearOptionWithoutSelectedTag();

      var bodyData = this.getNoHtmlContentBody();
      bodyData = bodyData.replace(/ \./g, '.');

      var dataForm = {
        "ad_body": bodyData,
        "ad_title": this.homeForm.value.ad_title,
        "department": this.homeForm.value.department,
        "city": this.homeForm.value.city,
        "country": this.homeForm.value.country
      };

      this.updateJob(dataForm, this.updateData)
        .then((dataUpdate) => {
          // start of approve job
          this.jobService.approve({ jobad_id: this.updateData })
            .subscribe(
              jobList => {
                //response
                //  this.spinner.hide();
                this.spinner.hide();
                if (jobList.is_approved == true) {
                  this.templateMsg = "Job Approved successfully";

                  this.modalRef = this.modalService.show(template);
                  this.router.navigateByUrl('/joblisting');
                }
                else {
                  // this.spinner.hide();
                  this.templateMsg = "Unable To Approve Job :approve";
                  this.modalRef = this.modalService.show(template);

                }

              },
              err => {
                //  //debugger;
                this.spinner.hide();
                this.templateMsg = "Unable To Approve Job : approve";
                this.modalRef = this.modalService.show(template);

              }
            );
          //end of approve job
        })
        .catch((err) => {
          this.spinner.hide();
          this.templateMsg = "Unable To Approve Job : update issue";

          this.modalRef = this.modalService.show(template);
        })

    }
    this.whetherButtonClicked = false;


  }

  //finishes job and marks the end of job
  finish(template) {
    this.whetherButtonClicked = true;

    this.spinner.show();
    if (this.selectedJobStatus == 2) {
      this.jobService.finish({ jobad_id: this.updateData })
        .subscribe(
          jobList => {
            //response
            this.spinner.hide();
            // this.spinner.hide();
            if (jobList.is_finished == true) {
              // this.router.navigateByUrl('/joblisting');
              this.selectedJobStatus = 3;
              this.statusUpdate();
              this.templateMsg = "Job finished successfully";

              this.modalRef = this.modalService.show(template);
            }
            else {
              this.spinner.hide();
              this.templateMsg = "Unable To Finish Job";
              this.modalRef = this.modalService.show(template);

            }


          },
          err => {
            //  //debugger;
            this.spinner.hide();
            this.templateMsg = "Unable To Finish Job";

            this.modalRef = this.modalService.show(template);

          }
        );
    }
    else if (this.selectedJobStatus == 0) {
      this.clearOptionWithoutSelectedTag();

      var bodyData = this.getNoHtmlContentBody();
      bodyData = bodyData.replace(/ \./g, '.');

      var dataForm = {
        "ad_body": bodyData,
        "ad_title": this.homeForm.value.ad_title,
        "department": this.homeForm.value.department,
        "city": this.homeForm.value.city,
        "country": this.homeForm.value.country
      };
      this.updateJob(dataForm, this.updateData)
        .then((datax) => {
          this.jobService.finish({ jobad_id: this.updateData })
            .subscribe(
              jobList => {
                //response
                //  this.spinner.hide();
                this.spinner.hide();
                if (jobList.is_finished == true) {
                  // this.router.navigateByUrl('/joblisting');
                  this.selectedJobStatus = 3;
                  this.statusUpdate();
                  this.templateMsg = "Job finished successfully";

                  this.modalRef = this.modalService.show(template);
                }
                else {
                  this.spinner.hide();
                  this.templateMsg = "Unable To Finish Job";
                  this.modalRef = this.modalService.show(template);

                }


              },
              err => {
                //  //debugger;
                this.spinner.hide();
                this.templateMsg = "Unable To Finish Job";

                this.modalRef = this.modalService.show(template);

              }
            );
        })
        .catch((err) => {
          this.spinner.hide();
          this.templateMsg = "Unable To Finish Job";

          this.modalRef = this.modalService.show(template);
        });

    }

    this.whetherButtonClicked = false;

  }

  //shares job
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
          //  //debugger;
          this.spinner.hide();
          this.modalRef = this.modalService.show(template);

        }
      );

  }



  // removes only dropdown content tags with text and does not modifies rest html
  getNoHtmlContentBody() {
    // debugger;
    var data = document.querySelector(".ngx-editor-textarea").innerHTML;

    var getClass = document.getElementsByClassName("dropdown-ex");
    var length = getClass.length;
    var replArr = [];
    for (var k = 0; k < length; k++) {
     // //debugger;
      var getID = document.getElementsByClassName('dropdown-ex')[k];
      var getText = document.getElementsByClassName('dropdown-ex')[k].textContent.trim();

      replArr.push({ id: getID, value: " "+getText });
    }

    replArr.map((key) => {
      $(key.id).replaceWith(key.value);
    });
    // console.log(document.querySelector(".ngx-editor-textarea").innerHTML);


//  Put the filtered html(without drop downs) in a result variable
   // var result =  document.querySelector(".ngx-editor-textarea").innerHTML.replace(/\s+/g, ' ');

    var result =  document.querySelector(".ngx-editor-textarea").innerHTML.replace(/\s+/g, ' ');

    //  Put back the original body in editor
    document.querySelector(".ngx-editor-textarea").innerHTML = data;
    //  Position the curson at the end.
    let inputFields = document.getElementsByClassName("ngx-editor-textarea")[0];
    if(!this.whetherButtonClicked){
    this.placeCaretAtEnd(inputFields);
    }
    // return result
   // setCurrentCursorPosition(this.prevPositionOfCaret);
    // console.log(result);
    return result;
  }



  //removes suggestion options from dropdown
  clearOptionWithoutSelectedTag() {
    var selectBoxes = document.querySelectorAll(".form-ele");
   // //debugger;

    // console.log(selectBoxes);
    for (var i = 0; i < selectBoxes.length; i++) {
      selectBoxes[i].remove();
      //var getUlAtrr = selectBoxes[i].removeChild(selectBoxes[i].childNodes[0]);

    }
    var selectBoxes = document.querySelectorAll(".form-ele");
    // console.log(selectBoxes);
   // //debugger;

  }

  //sets welcome dialog to be displayed or not
  setDialogState(e) {
    if (e == true) {
      localStorage.setItem("dialogOff", "true");
    }
    else {
      localStorage.setItem("dialogOff", "false");

    }
  }



  //records  press event [left for future use]
  onKeydown(event) {
  //  //debugger;
    this.hasModalChange = true;
  }




  // called by intervalJobProcess
  //Filter and hits analyze service
  processJobService() {
    this.serviceCallStatus = true;

    this.clearOptionWithoutSelectedTag();

    // console.log(this.lastTypedText);
    this.lastTypedText = this.getNoHtmlContentBody();

    var jobForm = {
      jobad_title: this.homeForm.value.ad_title,
      jobad_body: this.lastTypedText
    };

    this.jobService
      .analyzeJob(jobForm)
      .subscribe(
        (updatedJob: any) => {
          console.log("Request Body: " + this.lastTypedText);
          console.log("Response: ");
          console.log(updatedJob);
          this.serviceReply = updatedJob;
          this.percBiasedMaleWords = updatedJob.percentages.perc_biased_male_words.toFixed(0);
          this.percBiasedFemaleWords = updatedJob.percentages.perc_biased_female_words.toFixed(0);
          this.percBiasedEthinicityWords = updatedJob.percentages.perc_biased_ethnicity_words.toFixed(0);
          this.percBiasedAgeWords = updatedJob.percentages.perc_biased_age_words.toFixed(0);
          this.ddScore = updatedJob.biases.dd_score.toFixed(0);
          this.ddScoreText = updatedJob.biases.dd_score_text;
          // fetch latest body again
          this.lastTypedText = this.getNoHtmlContentBody();

          this.afterServiceProcessData(this.lastTypedText);

          //clear and fetch new data
        },
        err => {
          this.spinner.hide();
          // console.log(err);
          this.serviceCallStatus = false;
        }
      );

  }

  // not in use / for future use
  pasteEvent(e) {

  }

  //generate random string
  makeid() {
    var text = "";
    var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text.toLowerCase();
  }



  // called by processJobService after services has finished processing for building html text
  afterServiceProcessData(lastTypedText) {
    //debugger;
    var index = 0;

    var finalReplacementSetArr = [];

    var textToBeReplaced = lastTypedText;
    // console.log(lastTypedText);
    if (lastTypedText != "") {

      var testing = lastTypedText;

      if (this.serviceReply != undefined) {
        if (Object.keys(this.serviceReply.biases.bias_analysis).length > 0) {
          for (var i = 0; i < this.serviceReply.biases.bias_analysis.sentences.length; i++) {
            var getPhrase = this.serviceReply.biases.bias_analysis.sentences[i].phrases;
            for (var j = 0; j < getPhrase.length; j++) {
              //debugger;
              var resultOfProcess = this.processReplacableHtmlStructure(i, j);
              finalReplacementSetArr.push(resultOfProcess);

            }
            // console.log(finalReplacementSetArr);

            // if (finalReplacementSetArr.length > 0) {
            //   for (var frsa = 0; frsa < finalReplacementSetArr.length; frsa++) {
            //     //debugger;
            //     if (finalReplacementSetArr[frsa].key.includes("?")) {
            //       finalReplacementSetArr[frsa].key = finalReplacementSetArr[frsa].key.replace("?", "\\?");
            //     }
            //     var reFrsa = new RegExp(finalReplacementSetArr[frsa].key, 'gi');
            //     var getProcessedValue =  this.getReplaceValue( finalReplacementSetArr[frsa].value,frsa);
            //     textToBeReplaced = textToBeReplaced.replace(reFrsa, getProcessedValue);
            //   }

            // }
          }
          // console.log(finalReplacementSetArr);
          if (finalReplacementSetArr.length > 0) {
            for (var frsa = 0; frsa < finalReplacementSetArr.length; frsa++) {
              if (finalReplacementSetArr[frsa].key.includes("?")) {
                finalReplacementSetArr[frsa].key = finalReplacementSetArr[frsa].key.replace("?", "\\?");
              }
              var reFrsa = new RegExp(finalReplacementSetArr[frsa].key, 'gi');

              textToBeReplaced = textToBeReplaced.replace(reFrsa, finalReplacementSetArr[frsa].value);
              
            }

          }

          this.editorClass = "readonly editors";
          $(".ngx-editor-textarea").blur();

          var buildBody = this.buildJobContentAfterServiceCall(textToBeReplaced, lastTypedText);

          // $(".ngx-editor-textarea").animate({ scrollTop: $(document).height() }, 0);

          document.querySelector(".ngx-editor-textarea").innerHTML = buildBody;

          // this.lastJobBody = buildBody;
          this.editorClass = "editors";


          let inputFields = document.getElementsByClassName("ngx-editor-textarea")[0];
          if(!this.whetherButtonClicked){
          this.placeCaretAtEnd(inputFields);
          }
          // console.log("after service" + this.prevPositionOfCaret);
          //let inField =  document.querySelector(".ngx-editor-textarea");
          //setCaretPosition(inputFields,this.prevPositionOfCaret);
          if (this.isReloadedData) {
            this.spinner.hide();
            $(".ngx-editor-textarea").blur();
          }
          this.serviceCallStatus = false;
        }
        else {
          this.editorClass = "readonly editors";
          $(".ngx-editor-textarea").blur();

          // $(".ngx-editor-textarea").animate({ scrollTop: $(document).height() }, 0);

          this.homeForm.patchValue({ ad_body: lastTypedText });

          // this.lastJobBody = this.completeJobBody;
          this.editorClass = "editors";
          let inputFields = document.getElementsByClassName("ngx-editor-textarea")[0];
          if(!this.whetherButtonClicked){
          this.placeCaretAtEnd(inputFields);
          }
          //setCaretPosition(inputFieldsaa,this.prevPositionOfCaret);

          // console.log("biasis analysis empty");
          if (this.isReloadedData) {
            $(".ngx-editor-textarea").blur();
          }

          this.serviceCallStatus = false;

        }
        //loads jquery needed for dom operations
        this.loadingJquery();
      }


    }

  }


  //replaces value with id
  getReplaceValue(value, loop) {
    let oldValue = '<span class="dropdown-ex">';
    let makeID = this.makeid() + '' + loop;
    let targetValue = '<span class="dropdown-ex"  id="' + makeID + '">';
    let newValue = value.replace(new RegExp(oldValue, "g"), targetValue);
    return newValue;
  }


  //focus cursor at end of html content
  placeCaretAtEnd(el) {
    //debugger;
    el.focus();
    if (typeof window.getSelection != "undefined"
      && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }




  //called by afterServiceProcessData to process service data
  processReplacableHtmlStructure(sentenceIndex, phraseIndex) {
    //debugger;
    var resultArr = [];
    var data = this.serviceReply.biases.bias_analysis.sentences[sentenceIndex].phrases[phraseIndex];
    var phraseKey = this.serviceReply.biases.bias_analysis.sentences[sentenceIndex].phrases[phraseIndex].key;  //"key": "a motivated individual we are"
    var phraseKey_cp = phraseKey;
    var phraseBiases = this.serviceReply.biases.bias_analysis.sentences[sentenceIndex].phrases[phraseIndex].biases;

    var secondLevelBiases = [];
    for (var k = 0; k < phraseBiases.length; k++) {
      var phraseBiases_key = phraseBiases[k].key;  // sentence->phrases->biases->key [part of sentence]
      /**
       *                                         "key": "motivated individual",
       *                                         "key": "we are",


       */
      var phraseBiases_key_cp = phraseBiases[k].key;
      var replaceableSubphrase = phraseBiases[k].replaceable_subphrases; // sentence->phrases->biases->replaceable_subphrases
      for (var l = 0; l < replaceableSubphrase.length; l++) {
        var replaceableSubphrase_key = replaceableSubphrase[l].key;// sentence->phrases->biases->replaceable_subphrases->key
        var re = new RegExp(replaceableSubphrase_key + '(?!([^ ]+)?>)', 'gi');
        var getPhraseAlternatives = replaceableSubphrase[l].alternatives;
        var assignColor;

        if (replaceableSubphrase[l].biased_towards_female == true) {
          assignColor = environment.female_color;
        }
        else if (replaceableSubphrase[l].biased_towards_male == true) {
          assignColor = environment.male_color;
        }
        else if (replaceableSubphrase[l].biased_towards_ethnicity == true) {
          assignColor = environment.ethnicity_color;
        }
        else {
          assignColor = environment.age_color
        }

        var d = new Date();
        var n = d.getMilliseconds();
        var makeID = this.makeid() + '' + n;

        var beginHtml = '<span class="dropdown-ex" id="' + makeID + '">';
        beginHtml += '<button class="openDrp"  style="color:' + assignColor + '" id="' + replaceableSubphrase[l].replaceable_subphrase_id + '">' + replaceableSubphrase_key + '</button> <span class="dropdown" contenteditable="false" style="display:none">';
        beginHtml += '<ul class="dropdown-select form-ele">';

        var buildAlternatives = getPhraseAlternatives.map(function (data) {
          return "<li class='drop' id='" + data.alternative_subphrase_id + "'>" + data.alternative_subphrase + "</li>";
        });
        var endHtml = `</ul></span></span>`;

        var joinbuildAlternatives = buildAlternatives.join("");

        var finalHtmlArr = [beginHtml, joinbuildAlternatives, endHtml];
        var finalHtmlStr = finalHtmlArr.join("");

        //level 3 replacement
        var phraseBiases_key = phraseBiases_key.replace(new RegExp(re, "gi"), finalHtmlStr);
      }
      secondLevelBiases[phraseBiases_key_cp] = phraseBiases_key;
    }


    for (var j in secondLevelBiases) {
      // console.log(secondLevelBiases[j]);
      // console.log(j);
      phraseKey = phraseKey.replace(new RegExp(j, "gi"), secondLevelBiases[j]);
    }


    // console.log(secondLevelBiases);
    // console.log(phraseKey);

    return { key: phraseKey_cp, value: phraseKey };

  }


  // creates & shares a job  and returns promise
  createJob() {
    return new Promise(resolve => {
      this.clearOptionWithoutSelectedTag();
      var bodyData = this.getNoHtmlContentBody();
      bodyData = bodyData.replace(/\s+/g, ' ');
      var dataForm = {
        "ad_body": bodyData,
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

            this.isSubmitting = false;
            resolve({ status: false, data: err });
          }
        );
    });
  }


  // creates job and returns promise
  createOnly(createData) {
    return new Promise((resolve, reject) => {
      this.jobService
        .create(createData)
        .subscribe(
          updatedUser => {
            resolve({ status: true, data: updatedUser });
          },
          err => {
            reject({ status: false, data: err });
          }
        );
    });

  }

  //check whether to enable save  button
  saveState() {
    return !this.homeForm.valid || this.isFinished;

  }

  //saves a job
  saveJob() {
    this.savingStatus = "Saving..... ";
    this.clearOptionWithoutSelectedTag();
    var bodyData = this.getNoHtmlContentBody();
    bodyData = bodyData.replace(/ \./g, '.');
    //debugger;
    // console.log(bodyData);
    ////debugger;
    var dataForm = {
      "ad_body": bodyData,
      "ad_title": this.homeForm.value.ad_title,
      "department": this.homeForm.value.department,
      "city": this.homeForm.value.city,
      "country": this.homeForm.value.country
    };
    if (this.updateData) {
      this.updateJob(dataForm, this.updateData)
        .then((datax: any) => {
          this.savingStatus = "";
          // console.log(datax);

          this.redirect(this.updateData, this.selectedJobStatus);
        })
        .catch((err) => {
          this.savingStatus = "Error Occured while updating...";

        });
    }
    else {
      this.createOnly(dataForm)
        .then((datax: any) => {
          this.savingStatus = "";
          this.redirect(datax.data.id, 0)
        })
        .catch((data) => {
          this.savingStatus = "Error Occured while creating...";
        });

    }
    this.whetherButtonClicked = false;
  }

  //shares  a job and returns promise
  shareJob(id) {
    return new Promise(resolve => {
      var email = this.email;
      var shareJob: object = { jobad_id: id, recipient: email };

      this.jobService
        .shareJob(shareJob)
        .subscribe(
          sharedUser => {
            resolve({ status: true, data: sharedUser, jobId: id });

          },
          err => {
            resolve({ status: false, data: err, jobId: id });

          }
        );
    });

  }

  //updates a job & returns promise
  updateJob(formData, id) {
    return new Promise((resolve, reject) => {

      this.jobService
        .update(formData, id)
        .subscribe(
          updateJob => {

            resolve({ status: true, data: updateJob });

          },
          err => {
            reject({ status: false, data: err, jobId: id });

          }
        );
    });

  }


  //called when data needs to be populated on update and need to be analyzed.
  analyzeAfterServicePopulate(data) {
    this.intervalJobProcess();
  }

  //fetched last typed text
  fetchLastTextTyped() {
    this.newlyAddedSentence = this.lastPastedText;
    return this.lastPastedText;

  }


  /** get data between two char */
  //not in use
  findNearesSpecialCharToLast() {
    var charTyped = this.charPressed;

  }
  
  //find last typed text
  findLastOccurence(str) {
    var lastCharLengthDot = str.lastIndexOf(".");
    var lastCharLengthExc = str.lastIndexOf("!");
    var lastCharLengthQues = str.lastIndexOf("?");

    var searchMax = Math.max(lastCharLengthDot, lastCharLengthExc, lastCharLengthQues);
    for (var j = searchMax - 1; j >= 0; j--) {
      if (str.charAt(j) == "!" || str.charAt(j) == "?" || str.charAt(j) == ".") {
        // console.log(j);
        // console.log(str.slice(j + 1, searchMax));
        return str.slice(j + 1, searchMax);
      }

    }



  }


  //count numbr of dots
  countPeriod(s1, letter) {
    return (s1.match(new RegExp(letter, 'g')) || []).length;
  }

  //builds job Content
  buildJobContentAfterServiceCall(textToBeReplaced, lastTypedText) {
    return textToBeReplaced;
  }

  //toggles suggestion dropdown
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  //part of alert not using
  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  //closes all unwanted modal
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
    this.whetherButtonClicked = false;
  }

  //fetches approval's email
  getApprovalEmail() {
    this.jobService
      .getApprovalEmails()
      .subscribe(
        (sharedEmail: any) => {
          //response
          // console.log(sharedEmail);
          this.statesComplex = sharedEmail.contacts;
        },
        err => {
          //  //debugger;

        }
      );
  }

  //destroy activities
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
    this.actionState = "add";
    this.isReloadedData = false;
  }

  //use to redirect with dynamic params
  redirect(id, status) {
    this.actionState = "update";
    this.router.navigateByUrl('/dashboard/editor?data=' + id );

  }
}
// Create Element.remove() function if not exist
if (!('remove' in <any>Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

// sets a cursor position 
function setCaretPosition(ctrla, pos) {

  ctrla.focus();
  var textNode = ctrla.firstChild;
  //debugger;
  var caret = pos; // insert caret after the 10th character say
  var range = document.createRange();
  range.setStart(textNode, caret);
  range.setEnd(textNode, caret);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// gets cursor position
function getCaretPosition() {
  ////debugger;
  if (window.getSelection && window.getSelection().getRangeAt) {
    var range = window.getSelection().getRangeAt(0);
    var selectedObj = window.getSelection();
    var rangeCount = 0;
    var childNodes: any = selectedObj.anchorNode.parentNode.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i] == selectedObj.anchorNode) {
        break;
      }
      if (childNodes[i].outerHTML)
        rangeCount += childNodes[i].outerHTML.length;
      else if (childNodes[i].nodeType == 3) {
        rangeCount += childNodes[i].textContent.length;
      }
    }
    return range.startOffset + rangeCount;
  }
  return -1;
}
