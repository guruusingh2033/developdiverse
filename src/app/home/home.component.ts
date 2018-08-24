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

  savingStatus: String;
  isReadonly: boolean = false;
  currentUser: any;
  company: String;
  percBiasedMaleWords = 0;
  percBiasedFemaleWords = 0;
  percBiasedEthinicityWords = 0;
  percBiasedAgeWords = 0;
  ddScore: any;
  ddScoreStatus: any;
  lastTypedText: string;
  lastTypedTextForServer: string;
  lastPastedText: string;
  updatedBodyData: any;
  bodyBfrePaste: string = "";

  isPasted: boolean = false;
  isReloadedData: boolean = false;

  newlyAddedSentence: string;
  completeJobBody: string;

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

        if (this.actionState == "update" && this.updateData) {
          this.fetchJobDataById();
          //debugger;
          console.log("update entered");
          console.log(this.ad_body);

        }
        else {
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
          // open normal job add screen
          if (this.route.snapshot.params.id == 'editor') {
            this.openScreen = false;
          }
        }


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

  addClass() {
    if (this.isReadonly == true || this.f.ad_title.errors) {
      return "readonly editors";
    }
    else {
      return "editors";
    }
  }

  get f() { return this.homeForm.controls; }

  ngOnInit() {
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
        //debugger;
        // alert("hi");
        $('.dropdown').hide();
        var attrID = $(this).attr('id');
        $($(this).closest('div').children('.dropdown')).toggle()

      });

      $(".drop").click(function () {

        var currentSelected = $(this).text();
        console.log(currentSelected);
        var selectedId = $(this).parent();
        console.log(selectedId);
        console.log("find closest button");

        $(this).closest("div").parent("div").children("button").text(currentSelected);
        $(this).closest("div").parent("div").children("button").css('color', 'black');
        $(this).closest('div').toggle();

      });

      //   $(".dropdown").on("click", "li .drop", function(){
      //     alert("jkjk");
      // });

    });

    this.fetchUrlParams();


    if (this.updateData) {
      this.actionState = "update";
      this.fetchJobDataById();

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

    //this.ad_body = ``;
    this.homeForm.patchValue({ ad_body: "hello" });

    var input = document.getElementById('myInput');
    this.getApprovalEmail();
  }

  //loads jquery
  loadingJquery() {
    console.log("loaded jquery....");
    $(document).ready(function () {
      $(".dropdown").hide();
      $(".openDrp").mouseover(function () {
        //debugger;
        // alert("hi");
        $('.dropdown').hide();

        var attrID = $(this).attr('id');
        $($(this).closest('div').children('.dropdown')).toggle()

      });

      $(".drop").click(function () {
        var currentSelected = $(this).text();
        console.log(currentSelected);
        var selectedId = $(this).parent();
        console.log(selectedId);
        console.log("find closest button");
        $(this).closest("div").parent("div").children("button").text(currentSelected);
        $(this).closest("div").parent("div").children("button").css('color', 'black');
        var removeMainDiv = $(this).closest("div").parent("div").attr("id");
        selectedId.remove();

        $("#" + removeMainDiv).replaceWith(currentSelected);


        $(this).closest('div').toggle();

      });

      $(".ngx-editor-textarea").click(function () {
        $('.dropdown').hide();
      });

    });

  }

  fire() {
    console.log("fire")
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


  getUser() {
    this.profileService.get().subscribe(
      (userData) => {
        this.company = userData.company;
        this.homeForm.patchValue({ company: userData.company });

      }
    );
  }

  fetchUrlParams() {
    this.state = this.route.snapshot.params.id;
    this.route.queryParams
      .filter(params => params.data)
      .subscribe(params => {

        this.updateData = params.data;
        this.selectedJobStatus = params.status;
      });

  }



  fetchJobDataById() {
    this.loaderMsg = "Loading..";

    this.spinner.show();
    this.jobService.getJobListById(this.updateData)
      .subscribe(
        (jobList: any) => {
          //response
          this.analyzeAfterServicePopulate(jobList);
          console.log(jobList)
          this.spinner.hide();
          this.updatedData = jobList;
          this.statusUpdate();
          this.isOwner = jobList.is_owner;
          //  console.log(this.isOwner);
          this.homeForm.patchValue(jobList);
          this.ddScore = jobList.dd_score.toFixed(0);
          this.percBiasedFemaleWords = jobList.female_phrases_percentage;
          //  this.loadingJquery();
        },
        err => {
          //  debugger;

        }
      );
  }

  statusUpdate() {

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
        this.isReadonly = true;
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
    console.log("view checked");
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
      ;
      if (!this.createdJobId) {
        var res = this.createJob()
          .then((res: any) => {
            if (res.status == true) {
              this.spinner.hide();
              ;
              this.templateMsg = "A notification has been sent to your Colleague’s email";
              this.closeFirstModal();
              this.modalRef = this.modalService.show(template);
              this.router.navigateByUrl('/joblisting');

            }
            else {
              ;
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
            this.dialogErr = err
          });
      }
      else {

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
        this.isReadonly = true;
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
  approve(template) {
    this.spinner.show();
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

      // this.updateJob(dataForm, this.updateData)
      //   .then((dataUpdate) => {
      // start of approve job
      this.jobService.approve({ jobad_id: this.updateData })
        .subscribe(
          jobList => {
            //response
            //  this.spinner.hide();
            this.spinner.hide();
            if (jobList.is_approved == true) {
              this.router.navigateByUrl('/joblisting');
            }
            else {
              // this.spinner.hide();
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
            this.spinner.hide();
            // this.spinner.hide();
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
        })
        .catch((err) => {
          this.spinner.hide();
          this.templateMsg = "Unable To Finish Job";

          this.modalRef = this.modalService.show(template);
        });

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
    var selectBox = this.elRef.nativeElement.querySelectorAll('.openDrp');
    // console.log(selectBox);
    for (var i = 0; i < selectBox.length; i++) {

      selectBox[i].addEventListener('click', this.fire.bind(this));
      // console.log("binded");
    }
  }

  modelChanged(data) {

    // console.log("fire");
    //this.dropdownSelect();
  }
  magic() {
    // console.log(this.ad_body);
  }


  // getNoHtmlContentBody() {

  //   var data = document.querySelector(".ngx-editor-textarea").innerHTML;
  //   // console.log(data);
  //   // var html=this.ad_body;
  //   var dom = document.createElement("DIV");
  //   dom.innerHTML = data;
  //   var plain_text = (dom.textContent || dom.innerText);
  //   if (document.getElementsByClassName("dropdown-ex")[0]) {
  //     var desi_text = document.getElementsByClassName("dropdown-ex")[0].textContent;
  //   }
  //   //debugger;
  //   return this.noHtmlContent = plain_text.replace(/\s+/g, ' ');

  // }


  getNoHtmlContentBody() {
    debugger;
    var data = document.querySelector(".ngx-editor-textarea").innerHTML;
    // console.log(data);
    // var html=this.ad_body;
    // var dom = document.createElement("DIV");
    //  dom.innerHTML = data;
    //  var plain_text = (dom.textContent || dom.innerText);

    var getClass = document.getElementsByClassName("dropdown-ex");
    var length = getClass.length;
    var replArr = [];
    for (var k = 0; k < length; k++) {
      debugger;
      var getID = document.getElementsByClassName('dropdown-ex')[k].getAttribute("id");
      var getText = document.getElementsByClassName('dropdown-ex')[k].textContent;
      replArr.push({ id: getID, value: getText });
    }

    replArr.map((key) => {
      $("#" + key.id).replaceWith(key.value);
    });

    //  return this.noHtmlContent = plain_text.replace(/\s+/g, ' ');
    return document.querySelector(".ngx-editor-textarea").innerHTML;
  }


  // getNoHtmlContent(content) {

  //   var data = content;
  //   // console.log(data);
  //   // var html=this.ad_body;
  //   var dom = document.createElement("DIV");
  //   dom.innerHTML = data;
  //   var plain_text = (dom.textContent || dom.innerText);
  //   if(document.getElementsByClassName("dropdown-ex")[0]){
  //     var desi_text =  document.getElementsByClassName("dropdown-ex")[0].textContent ;
  //     }
  //   //debugger;
  //   return this.noHtmlContent = plain_text.replace(/\s+/g, ' ');

  // }


  getNoHtmlContent(content) {
    debugger;
    var data = content;
    // console.log(data);
    // var html=this.ad_body;
    var dom = document.createElement("DIV");
    dom.innerHTML = data;
    var replArr = [];

    var getClass = dom.getElementsByClassName("dropdown-ex");
    if (getClass.length > 0) {
      for (var b = 0; b < getClass.length; b++) {
        var getID = dom.getElementsByClassName('dropdown-ex')[b].getAttribute("id");
        var getText = dom.getElementsByClassName('dropdown-ex')[b].textContent;
        replArr.push({ id: getID, value: getText });
      }


      replArr.map((key) => {
        $("#" + key.id).replaceWith(key.value);
      });
      return dom.innerHTML;

    }

    return content;

    //  console.log(getClass);
    //  debugger;
    // var plain_text = (dom.textContent || dom.innerText);

    // return this.noHtmlContent = plain_text.replace(/\s+/g, ' ');

  }


  getNoHtmlContentServer(content) {
    content = content.replace(/<br\s*\/?>/gi, ' ');
    var data = content;
    // console.log(data);
    // var html=this.ad_body;
    var dom = document.createElement("DIV");
    dom.innerHTML = data;

    //  console.log(getClass);
    //  debugger;
    var plain_text = (dom.textContent || dom.innerText);

    return this.noHtmlContent = plain_text.replace(/\s+/g, ' ');

  }



  clearOptionWithoutSelectedTag() {
    var selectBoxes = document.querySelectorAll(".form-ele");
    console.log(selectBoxes);
    for (var i = 0; i < selectBoxes.length; i++) {
      selectBoxes[i].remove();
    }
    var selectBoxes = document.querySelectorAll(".form-ele");

  }

  setDialogState() {
    if (localStorage.getItem("dialogOff") == "true") {
      localStorage.setItem("dialogOff", "false");
    }
    else {
      localStorage.setItem("dialogOff", "true");

    }
  }



  // this function is used mostly to remove last line content.
  updateBodyState() {
    debugger;
    if (this.isPasted == false) {
      var bodyData = this.homeForm.value.ad_body;
      var lastChar = bodyData[bodyData.length - 1];
      //debugger;
      var split = bodyData.split(".");
      var getLength = split.length;
      var getLastIndex = getLength - 2;
      split.length = getLastIndex;
      this.updatedBodyData = split;
      console.log(this.updatedBodyData);
      //debugger;
    }
    else if (this.isPasted == true && this.isReloadedData == false) {
      //debugger;
      this.updatedBodyData = [];
      this.updatedBodyData.push(this.bodyBfrePaste);
    }
    else if (this.isReloadedData == true) {
      this.updatedBodyData = [];
      this.isReloadedData = false;
    }
  }

  //records dot press event
  onKeydown(event) {
    if (event.keyCode == 190 || event.keyCode == 191 || event.keyCode == 49) {
      this.completeJobBody = document.querySelector(".ngx-editor-textarea").innerHTML;
      console.log(this.completeJobBody);
      this.isPasted = false;
      console.log("body to be sent");
      console.log(event);
      if (this.isPasted) {
        this.lastTypedText = this.fetchLastTextTyped();
      }
      else {
        this.lastTypedText = this.fetchLastTextTyped();

      }
      debugger;
      this.processJobService();
      // },500);
    }
  }


  //Filter and hits analyze service
  processJobService() {
    debugger;

    console.log(this.lastTypedText);
    this.lastTypedText = this.getNoHtmlContent(this.lastTypedText);
    // this.lastTypedText = this.lastTypedText.replace(/  +/g, ' ');
    debugger;
    this.lastTypedTextForServer = this.getNoHtmlContentServer(this.lastTypedText);

    var jobForm = {
      jobad_title: this.homeForm.value.ad_title,
      jobad_body: this.lastTypedTextForServer
    };
    //debugger;
    //  this.spinner.show();
    this.jobService
      .analyzeJob(jobForm)
      .subscribe(
        (updatedJob: any) => {
          console.log(updatedJob);
          this.serviceReply = updatedJob;
          this.percBiasedMaleWords = updatedJob.percentages.perc_biased_male_words.toFixed(0);
          this.percBiasedFemaleWords = updatedJob.percentages.perc_biased_female_words.toFixed(0);
          this.percBiasedEthinicityWords = updatedJob.percentages.perc_biased_ethnicity_words.toFixed(0);
          this.percBiasedAgeWords = updatedJob.percentages.perc_biased_age_words.toFixed(0);
          this.ddScore = updatedJob.biases.dd_score.toFixed(0);
          this.afterServiceProcessData(this.lastTypedText);

          //clear and fetch new data
        },
        err => {
          this.spinner.hide();
          console.log(err)
        }
      );

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




  afterServiceProcessData(lastTypedText) {
    debugger;
    var index = 0;
    //your code
    // console.log("Spacebar fired");
    var finalReplacementSetArr = [];
    // var lastTypedText: any = this.fetchLastTextTyped();
    var textToBeReplaced = lastTypedText;
    console.log(lastTypedText);
    if (lastTypedText != "") {
      // var n = this.homeForm.value.ad_body.includes(".");
      // if (n) {
      var testing = lastTypedText;

      if (this.serviceReply != undefined) {
        if (Object.keys(this.serviceReply.biases.bias_analysis).length > 0) {
          for (var i = 0; i < this.serviceReply.biases.bias_analysis.sentences.length; i++) {
            var getPhrase = this.serviceReply.biases.bias_analysis.sentences[index].phrases;
            for (var j = 0; j < getPhrase.length; j++) {
              var resultOfProcess = this.processReplacableHtmlStructure(i, j);
              finalReplacementSetArr.push(resultOfProcess);

            }
            console.log(finalReplacementSetArr);
            //debugger;
            if (finalReplacementSetArr.length > 0) {
              for (var frsa = 0; frsa < finalReplacementSetArr.length; frsa++) {
                var reFrsa = new RegExp(finalReplacementSetArr[frsa].key, 'gi');

                textToBeReplaced = textToBeReplaced.replace(reFrsa, finalReplacementSetArr[frsa].value);
              }

              // console.log(textToBeReplaced);

              // this.spinner.hide();


            }
          }


          var buildBody = this.buildJobContentAfterServiceCall(textToBeReplaced, lastTypedText);
          //debugger;
          this.homeForm.patchValue({ ad_body: buildBody });
          // this.ad_body = buildBody;

          let inputFields = document.getElementsByClassName("ngx-editor-textarea")[0];
          this.placeCaretAtEnd(inputFields);
        }
        else {
          // var buildBody = this.buildJobContentAfterServiceCall(textToBeReplaced);
          this.homeForm.patchValue({ ad_body: this.completeJobBody });
          let inputFields = document.getElementsByClassName("ngx-editor-textarea")[0];
          this.placeCaretAtEnd(inputFields);
          console.log("biasis analysis empty");
          //  this.spinner.hide();

        }

        this.loadingJquery();
      }
      // }
      //this.ad_body = this.buildJobContentAfterServiceCall(testing);

      //console.log(this.ad_body);

    }

  }

  //focus cursor at end
  placeCaretAtEnd(el) {
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
          assignColor = "#f641ff";
        }
        else if (replaceableSubphrase[l].biased_towards_male == true) {
          assignColor = "#25b0ef";
        }
        else if (replaceableSubphrase[l].biased_towards_ethnicity == true) {
          assignColor = "#ed7c31";
        }
        else {
          assignColor = "#35b150"
        }

        var d = new Date();
        var n = d.getMilliseconds();
        var makeID = this.makeid() + '' + n;

        var beginHtml = '<div class="dropdown-ex"  id="' + makeID + '"> ';
        beginHtml += '<button class="openDrp"  style="color:' + assignColor + '" id="' + replaceableSubphrase[l].replaceable_subphrase_id + '">' + replaceableSubphrase_key + '</button> <div class="dropdown" contenteditable="false">';
        beginHtml += '<ul class="dropdown-select form-ele">';

        var buildAlternatives = getPhraseAlternatives.map(function (data) {
          return "<li class='drop' id='" + data.alternative_subphrase_id + "'>" + data.alternative_subphrase + "</li>";
        });
        var endHtml = `</ul></div></div>`;

        var joinbuildAlternatives = buildAlternatives.join("");

        var finalHtmlArr = [beginHtml, joinbuildAlternatives, endHtml];
        var finalHtmlStr = finalHtmlArr.join("");

        //level 3 replacement 
        var phraseBiases_key = phraseBiases_key.replace(re, finalHtmlStr);
      }
      secondLevelBiases[phraseBiases_key_cp] = phraseBiases_key;
    }


    //  phraseKey = secondLevelBiases.map(function(datax){
    //   return  phraseKey.replace(datax.key,datax.value);
    // });

    for (var j in secondLevelBiases) {
      // phraseKey =  phraseKey.replace(secondLevelBiases[j].key,secondLevelBiases[j].value);
      console.log(secondLevelBiases[j]);
      console.log(j);
      phraseKey = phraseKey.replace(j, secondLevelBiases[j]);
    }


    console.log(secondLevelBiases);
    console.log(phraseKey);

    // resultArr[phraseKey_cp] = phraseKey;
    // console.log(resultArr);
    return { key: phraseKey_cp, value: phraseKey };

  }



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
                //debugger;

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

  saveState() {
    return !this.homeForm.valid || this.isFinished || this.isApproved || this.isShared;

  }

  saveJob() {
    this.savingStatus = "Saving..... ";
    this.clearOptionWithoutSelectedTag();
    var bodyData = this.getNoHtmlContentBody();
    bodyData = bodyData.replace(/ \./g, '.');
    debugger;
    console.log(bodyData);
    //debugger;
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
          console.log(datax);

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
  }


  shareJob(id) {
    //debugger;
    return new Promise(resolve => {
      var email = this.email;
      var shareJob: object = { jobad_id: id, recipient: email };

      this.jobService
        .shareJob(shareJob)
        .subscribe(
          sharedUser => {
            //response
            //debugger;
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
    //debugger;
    return new Promise((resolve, reject) => {

      this.jobService
        .update(formData, id)
        .subscribe(
          updateJob => {
            //response
            //debugger;
            resolve({ status: true, data: updateJob });

          },
          err => {
            //  debugger;
            reject({ status: false, data: err, jobId: id });

          }
        );
    });

  }




  pasteEvent(data) {
    this.isPasted = true;
    // if (this.homeForm.value.ad_body == "") {
    console.log(data.clipboardData.getData('text/html'));
    this.lastPastedText = data.clipboardData.getData('text/plain');
    this.completeJobBody = document.querySelector(".ngx-editor-textarea").innerHTML + ' ' + this.lastPastedText;

    //debugger;
    this.lastTypedText = this.fetchLastTextTyped();

    this.processJobService();
    //  }

  }

  analyzeAfterServicePopulate(data) {
    this.isPasted = true;
    this.isReloadedData = true;
    this.homeForm.patchValue({ ad_title: data.ad_title });
    // this.completeJobBody = document.querySelector(".ngx-editor-textarea").innerHTML;
    this.completeJobBody = data.ad_body.replace(/  +/g, ' ');

    this.lastPastedText = data.ad_body.replace(/&nbsp;/g, '').replace(/  +/g, ' ');
    debugger;
    this.lastTypedText = this.fetchLastTextTyped();

    console.log(this.actionState);
    debugger;
    if (this.lastPastedText != "") {
      this.processJobService();
    }
  }
  /** end from old functionlit */

  //fetched last typed text
  fetchLastTextTyped() {
    debugger;
    var bodyData = this.getNoHtmlContentServer(this.completeJobBody);

    if (this.isPasted == false) {
      var periodOccurence = this.countPeriod(bodyData, "\\.");
      debugger;
      if (periodOccurence == 1) {
        return bodyData;
      }
      else {
        var data = bodyData.split(".");
        var filterData = data.filter(filt => filt != "");
        var dataLength = filterData.length;
        var getLastIndex = dataLength - 1;
        console.log(data);
        return filterData[getLastIndex] + ".";
      }
    }
    else if (this.isPasted == true) {
      debugger;
      return this.lastPastedText;
    }
  }


  //count numbr of dots
  countPeriod(s1, letter) {
    return (s1.match(RegExp(letter, 'g')) || []).length;
  }

  //builds job Content
  buildJobContentAfterServiceCall(textToBeReplaced, lastTypedText) {
    debugger;
    lastTypedText = lastTypedText.trim();
    var getBodyText = this.completeJobBody.replace(/&nbsp;/g, '').replace(/  +/g, ' ');;
    if (getBodyText == "") {
      return textToBeReplaced;
    }
    else {
      var finalHtml = getBodyText.replace(new RegExp(lastTypedText, "gi"), textToBeReplaced);
      return finalHtml;
    }
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
    this.actionState = "add";

  }

  redirect(id, status) {
    //debugger;
    this.actionState = "update";
    this.router.navigateByUrl('/dashboard/editor?data=' + id + '&status=' + status);

  }
}


function fire() {
  alert("ddf")
  $(".dropdown").hide();
}
