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
  percBiasedMaleWords: any;
  percBiasedFemaleWords: any;
  ddScore: any;
  lastTypedText: string;
  lastPastedText: string;
  updatedBodyData: any;

  isPasted: boolean = false;
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
          debugger;
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
    if (this.isReadonly == true) {
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

    $(document).ready(function () {
      $(".dropdown").hide();
      $(".openDrp").click(function () {
        debugger;
        // alert("hi");
        var attrID = $(this).attr('id');
        $($(this).closest('div').children('.dropdown')).toggle()
        //  console.log($("#" +attrID).children('.$(this)'));
        //   $(this).append(dropdown);


        // var selectBox = document.querySelectorAll('.drop');
        // console.log(selectBox);
        // for(var i=0;i<selectBox.length;i++){
        //   console.log(selectBox[i]);
        // selectBox[i].addEventListener('click',fire.bind(this),false);
        //  console.log("binded");
        // }
      });

      $(".drop").click(function () {
        //   alert("hello");
        // console.log($(this).attr('id');
        var currentSelected = $(this).text();
        console.log(currentSelected);
        var selectedId = $(this).parent();
        console.log(selectedId);
        //console.log($(this).closest('div'));
        console.log("find closest button");
        //   console.log($(this).find('button'));
        // console.log($(this).closest("div").parent("div").children("a").text());
        $(this).closest("div").parent("div").children("button").text(currentSelected);
        $(this).closest("div").parent("div").children("button").css('color', 'green');
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
    this.homeForm.patchValue({ ad_title: "test" });

    //this.ad_body = ``;

    //  this.ad_body =`Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over <span id='content' style='color:green' (click)='call()'>content</span>. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> is mostly a part of a Latin text by the classical author and philosopher Cicero. Its words and letters have been changed by addition or removal, so to deliberately render its <span id='content' style='color:green' (click)='call()'>content</span> nonsensical; it's not genuine, correct, or comprehensible Latin anymore. While lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span>'s still resembles classical Latin, it actually has no meaning whatsoever. As Cicero's text doesn't contain the letters K, W, or Z, alien to latin, these, and others are often inserted randomly to mimic the typographic appearence of European languages, as are digraphs not to be found in the original.  In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual <span id='content' style='color:green' (click)='call()'>content</span> still not being ready. Think of a news blog that's filled with <span id='content' style='color:green' (click)='call()'>content</span> hourly on the day of going live. However, reviewers tend to be distracted by comprehensible <span id='content' style='color:green' (click)='call()'>content</span>, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements. Besides, random text risks to be unintendedly humorous or offensive, an unacceptable risk in corporate environments. Lorem <span id='ipsum' style='color:red' (click)='call()'>ipsum</span> and its many variants have been employed since the early 1960ies, and quite likely since the sixteenth century.` ; 
    var input = document.getElementById('myInput');
    this.serviceReply = {
      "biases": {
        "dd_score": 5.07,
        "bias_analysis": {
          "sentences": [
            {
              "key": "I am a motivated individual, I think",
              "phrases": [
                {
                  "key": "a motivated individual",
                  "biases": [
                    {
                      "key": "motivated individual",
                      "biased_phrase_id": 44,
                      "replaceable_subphrases": [
                        {
                          "key": "motivated",
                          "replaceable_subphrase_id": 21,
                          "biased_towards_female": true,
                          "alternatives": [
                            {
                              "alternative_subphrase_id": 148,
                              "alternative_subphrase": "driven",
                              "selected_counter": 0
                            }
                          ]
                        },
                        {
                          "key": "individual",
                          "replaceable_subphrase_id": 24,
                          "biased_towards_female": false,
                          "alternatives": [
                            {
                              "alternative_subphrase_id": 152,
                              "alternative_subphrase": "person",
                              "selected_counter": 0
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      "percentages": {
        "num_total_words": 8,
        "num_biased_male_words": 1,
        "num_biased_female_words": 1,
        "perc_biased_male_words": 12.5,
        "perc_biased_female_words": 12.5
      }
    };
    // console.log(this.serviceReply.biases.biases[0].key);
    this.getApprovalEmail();
  }


  loadingJquery() {
    console.log("loaded jquery....");
    $(document).ready(function () {
      $(".dropdown").hide();
      $(".openDrp").click(function () {
        debugger;
        // alert("hi");
        var attrID = $(this).attr('id');
        $($(this).closest('div').children('.dropdown')).toggle()
        //  console.log($("#" +attrID).children('.$(this)'));
        //   $(this).append(dropdown);


        // var selectBox = document.querySelectorAll('.drop');
        // console.log(selectBox);
        // for(var i=0;i<selectBox.length;i++){
        //   console.log(selectBox[i]);
        // selectBox[i].addEventListener('click',fire.bind(this),false);
        //  console.log("binded");
        // }
      });

      $(".drop").click(function () {
        //   alert("hello");
        // console.log($(this).attr('id');
        var currentSelected = $(this).text();
        console.log(currentSelected);
        var selectedId = $(this).parent();
        console.log(selectedId);
        //console.log($(this).closest('div'));
        console.log("find closest button");
        //   console.log($(this).find('button'));
        // console.log($(this).closest("div").parent("div").children("a").text());
        $(this).closest("div").parent("div").children("button").text(currentSelected);
        $(this).closest("div").parent("div").children("button").css('color', 'green');
        selectedId.remove();
        $(this).closest('div').toggle();

      });

      //   $(".dropdown").on("click", "li .drop", function(){
      //     alert("jkjk");
      // });

    });

  }

  fire() {
    console.log("fire")
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
    debugger;
    this.state = this.route.snapshot.params.id;
    this.route.queryParams
      .filter(params => params.data)
      .subscribe(params => {
        // console.log("paramdata---")
        // console.log(params); // {order: "popular"}
        // console.log("paramdata-end--")

        this.updateData = params.data;
        this.selectedJobStatus = params.status;
        //  console.log(this.updateData); // popular
      });

  }



  fetchJobDataById() {
    debugger;
    this.loaderMsg = "Loading..";

    this.spinner.show();
    this.jobService.getJobListById(this.updateData)
      .subscribe(
        (jobList: any) => {
          //response
          this.analyzeAfterServicePopulate(jobList.ad_body);
          console.log(jobList)
          this.spinner.hide();
          this.updatedData = jobList;
          this.statusUpdate();
          this.isOwner = jobList.is_owner;
          //  console.log(this.isOwner);
          this.homeForm.patchValue(jobList);
          this.ddScore = jobList.dd_score;
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
      debugger;
      if (!this.createdJobId) {
        var res = this.createJob()
          .then((res: any) => {
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
    else if (this.selectedJobStatus == 0) {
      this.clearOptionWithoutSelectedTag();

      var bodyData = this.getNoHtmlContentBody();

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


  getNoHtmlContentBody() {

    var data = document.querySelector(".ngx-editor-textarea").innerHTML;
    // console.log(data);
    // var html=this.ad_body;
    var dom = document.createElement("DIV");
    dom.innerHTML = data;
    var plain_text = (dom.textContent || dom.innerText);
    return this.noHtmlContent = plain_text.replace(/\s+/g, ' ').trim();;

  }


  getNoHtmlContent(content) {

    var data = content;
    // console.log(data);
    // var html=this.ad_body;
    var dom = document.createElement("DIV");
    dom.innerHTML = data;
    var plain_text = (dom.textContent || dom.innerText);
    return this.noHtmlContent = plain_text.replace(/\s+/g, ' ').trim();;

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
    if (this.isPasted == false) {
      var bodyData = this.homeForm.value.ad_body;
      var split = bodyData.split(".");
      var getLength = split.length;
      var getLastIndex = getLength - 1;
      split.length = getLastIndex;
      this.updatedBodyData = split;
      console.log(this.updatedBodyData);
      debugger;
    }
    else if (this.isPasted == true) {
      debugger;
      this.updatedBodyData = [];
    }
  }

  onKeydown(event) {
    this.isPasted = false;

    if (event.keyCode == 190) {
      console.log(event)
      //this.clearOptionWithoutSelectedTag();
      //  var noHTml = this.getNoHtmlContentBody()+".";
      //  this.homeForm.patchValue({ad_body:noHTml});
      console.log("body to be sent");
      this.processJobService();
      // },500);
    }
  }


  processJobService() {
    //  console.log(this.ad_body);
    if (this.isPasted) {
      this.lastTypedText = this.fetchLastTextTyped();
    }
    else {
      this.lastTypedText = this.fetchLastTextTyped() + ".";

    }
    this.lastTypedText = this.getNoHtmlContent(this.lastTypedText);
    //  setTimeout(function(){
    //    alert("");

    var jobForm = {
      jobad_title: this.homeForm.value.ad_title,
      jobad_body: this.lastTypedText
    };
    debugger;
    this.spinner.show();
    this.jobService
      .analyzeJob(jobForm)
      .subscribe(
        (updatedJob: any) => {
          console.log(updatedJob);
          this.serviceReply = updatedJob;
          this.percBiasedMaleWords = updatedJob.percentages.perc_biased_male_words.toFixed(2);
          this.percBiasedFemaleWords = updatedJob.percentages.perc_biased_female_words.toFixed(2);
          this.ddScore = updatedJob.biases.dd_score;
          this.afterServiceProcessData(this.lastTypedText);

          //clear and fetch new data
        },
        err => {
          this.spinner.hide();
          console.log(err)
        }
      );

  }

  afterServiceProcess(lastTypedText) {
    var index = 0;
    //your code
    // console.log("Spacebar fired");
    console.log(lastTypedText);
    var n = this.homeForm.value.ad_body.includes(".");
    if (n) {
      var testing = lastTypedText;
      debugger;
      for (var i = 0; i < this.serviceReply.biases.bias_analysis.sentences[index].length; i++) {
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
          //   var color;
          // if(this.serviceReply.biases.bias_analysis.sentences[index].biases[i].key) 
          // var replaceValue =
          //   "<select  id='" + substrVal + i + "' style='color:"
          //   + this.serviceReply.biases.bias_analysis.sentences[index].biases[i].key +
          //   "' class='form-ele'> <option>" + test +
          //   "</option><option>test</option></select> ";
          //  if(testRegex == false){
          // testing = testing.replace(re, replaceValue);
          // testing = testing.replace('.','');
          //}

        }
      }
      //this.ad_body = this.buildJobContentAfterServiceCall(testing);

      //console.log(this.ad_body);

    }
  }

  afterServiceProcessData(lastTypedText) {
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
            debugger;
            if (finalReplacementSetArr.length > 0) {
              for (var frsa = 0; frsa < finalReplacementSetArr.length; frsa++) {
                textToBeReplaced = textToBeReplaced.replace(finalReplacementSetArr[frsa].key, finalReplacementSetArr[frsa].value);
              }

              var buildBody = this.buildJobContentAfterServiceCall(textToBeReplaced);
              debugger;
              //  this.ad_body = textToBeReplaced+".";
              this.homeForm.patchValue({ ad_body: buildBody });
              console.log(textToBeReplaced);
              //setTimeout( this.loadingJquery(), 3000);

              this.spinner.hide();


            }
          }
        }
        else {
          console.log("biasis analysis empty");

          this.spinner.hide();

        }

        this.loadingJquery();
      }
      // }
      //this.ad_body = this.buildJobContentAfterServiceCall(testing);

      //console.log(this.ad_body);

    }

  }


  processReplacableHtmlStructure(sentenceIndex, phraseIndex) {
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
          assignColor = "pink";
        }
        else {
          assignColor = "blue";
        }

        var beginHtml = '<div class="dropdown-ex"> ';
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
      this.clearOptionWithoutSelectedTag();
      var bodyData = this.getNoHtmlContentBody();
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
    return new Promise((resolve, reject) => {

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
            reject({ status: false, data: err, jobId: id });

          }
        );
    });

  }




  pasteEvent(data) {
    this.isPasted = true;
    console.log(data.clipboardData.getData('text/plain'));
    this.lastPastedText = data.clipboardData.getData('text/plain');
    debugger;
    this.processJobService();


  }

  analyzeAfterServicePopulate(data){
    this.isPasted = true;
    var dataPasted = document.querySelector(".ngx-editor-textarea").innerHTML;
    this.lastPastedText = data;
    debugger;
    if(this.lastPastedText != ""){
    this.processJobService();
    }
  }
  /** end from old functionlit */
  //fetched last typed text
  fetchLastTextTyped() {
    if (this.isPasted == false) {
      var data = this.homeForm.value.ad_body.split(".");
      var dataLength = data.length;
      var getLastIndex = dataLength - 1;
      console.log(data);
      this.updateBodyState();
      debugger;
      return data[getLastIndex];
    }
    else if (this.isPasted == true) {
      this.updateBodyState();
      return this.lastPastedText;
    }
  }

  //builds job Content
  buildJobContentAfterServiceCall(lastTypedText) {
    //return lastTypedText;
    var bodyContent = this.updatedBodyData;
    debugger;
    //  bodyContent = bodyContent.replace(/^./, '');
    //var data =bodyContent.split(".");   
    //   data.splice(-2, 2);
    // var dataLength = data.length;
    // var getLastIndex = dataLength - 1;
    //    console.log(data);
    //   data.length = getLastIndex;
    //  if(data.length > 0 ){
    //  bodyContent = data.join(".");
    if (bodyContent.length > 0) {
      bodyContent.push(lastTypedText);
      return bodyContent.join(".");
    }
    else {
      return lastTypedText;
    }
    //   }
    //   else{
    //   return lastTypedText ;

    //  }

    ;

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
    debugger;
    this.actionState = "update";
    this.router.navigateByUrl('/dashboard/editor?data=' + id + '&status=' + status);

  }
}


function fire() {
  alert("ddf")
  $(".dropdown").hide();
}
