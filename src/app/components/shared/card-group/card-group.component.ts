import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-card-group',
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.css']
})
export class CardGroupComponent implements OnInit {

  @Input() group: any = {};
  showGroupDetail: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.showGroupDetail = false;
  }

  ngOnInit(): void {
  }

  seeGroup(data: any) {
    const body = {
      groupName: data.groupName,
      description: data.description
    }
    this.router.navigate([`groups/detail/${data.id}`]);
    localStorage.setItem('group', JSON.stringify(body)) 
  }

}
