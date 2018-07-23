import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router,Route, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticleListConfig, TagsService, UserService } from '../core';

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

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService,
  ) {}

   isAuthenticated: boolean;
 
  ngOnInit() {
    debugger;
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

}
