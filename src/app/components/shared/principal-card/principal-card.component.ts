import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
// Model
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-principal-card',
  templateUrl: './principal-card.component.html',
  styleUrls: ['./principal-card.component.css']
})
export class PrincipalCardComponent implements OnInit, OnDestroy {

  cardHeader: string = 'Grupo de pruebas';
  groups: Group[] = [];
  groupTemplate: Group = new Group();
  private sub;
  showSpinner: boolean = true;
  messageNoData: boolean = false;
  groupData: Group;
  
  constructor(private transactionService: TransactionService, private router: Router) {    
    this.getGroups();
  }

  getGroups() {
    this.sub = this.transactionService.groupsRecords().subscribe(groups => {
      if (groups['success']) {
        this.groups = groups['data'];
        this.showSpinner = false;
      }

      if (this.groups.length == 0) {
        this.messageNoData = true;
      }      
    })
  }

  async getGroup(id: string) {
    try {
      const result = await this.transactionService.getGroup(id);
      localStorage.setItem('group', JSON.stringify(result['data']));      
    } catch (err) {
      console.log(err);
    }
  }  

  onSubmit(form: NgForm) {
    if (form.invalid) return false;

    // Swal.fire({
    //   allowOutsideClick: false,
    //   text: 'Espere por favor...',
    //   icon: 'info'
    // });

  }

  ngOnInit(): void {    
    // console.log(this.getGroups())
  }

  enterQuestions(id: string) {
    this.getGroup(id);        
    this.router.navigate([`group/${id}/question-section`]);
  }



  
  ngOnDestroy() {
    // this.sub.unsubscribe();
  }


}
