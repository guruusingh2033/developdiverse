import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ArticleListConfig, TagsService, UserService } from '../core';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3:BsModalRef;
  openScreen:boolean=true;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private userService: UserService
  ) {}

   isAuthenticated: boolean;
 
  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;

        // set the article list accordingly
       
      }
    );

   
  }

  loadJobEditor(){
    this.openScreen = false;
  }

  ngAfterViewInit(){
    let element:HTMLElement =  document.getElementById("modal") as HTMLElement;
    element.click(); 

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
