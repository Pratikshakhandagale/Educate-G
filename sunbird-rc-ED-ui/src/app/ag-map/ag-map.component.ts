import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general/general.service';

@Component({
  selector: 'app-ag-map',
  templateUrl: './ag-map.component.html',
  styleUrls: ['./ag-map.component.scss']
})
export class AgMapComponent implements OnInit {
  name = 'AG - Prerak Mapping';
  inputValue;
  form: FormGroup;
  form2: FormGroup;
  ags;
  msg = [];
  errmsg = [];
  constructor(private formBuilder: FormBuilder,public generalService: GeneralService,public router: Router,) { }

  ngOnInit() {
    if(!localStorage.getItem('isAdminEntity')){
      this.router.navigate(['/login'])
    }
    this.form = this.formBuilder.group({
      ag: ['', Validators.required],
      prerak: ['', Validators.required]
    })
    // this.onChanges();
  }

  // onChanges(): void {
  //   this.form.valueChanges.subscribe(value => {
  //     console.log('form input value', value);
  //   });

  //   this.form2.valueChanges.subscribe( value => {
  //     console.log(value);
  //   })
  // }

  onSubmit() {
    this.msg = [];
    this.errmsg = [];
    console.log(this.form.value);
    this.generalService
    .postData('PrerakV2/search', {
      "filters": {
          "osid": {
              "contains": this.form.value.prerak.trim()
          }
      }
  })
    .subscribe((res) => {
      console.log(res);
      var prerakId = res[0]["osid"];
      var prerakName = res[0]["fullName"];
      var parentOrganization = res[0]["parentOrganization"];
      this.ags = this.form.value.ag.split(',')
      for (const ag of this.ags) {
        console.log(ag);
        this.generalService
          .postData('AGV8/search', {
            "filters": {
                "osid": {
                    "contains": ag.trim()
                }
            }
        })
          .subscribe((res2) => {
            console.log("res2",res2);
            if(res2[0]){
              res2[0]["prerakId"]= prerakId;
              res2[0]["prerakName"]= prerakName;
              res2[0]["parentOrganization"]= parentOrganization
              if(res2[0].reasonOfLeavingEducation == "सामाजिक दबाव के कारण"){
                res2[0]['reasonOfLeavingEducation'] = "सामाजिक/पारिवारिक दबाव के कारण";
              }

              this.generalService.putData('AGV8',ag,res2[0]).subscribe((res3) => {
                console.log("updated",res3);
                this.msg.push("AG - "+res2[0]['AGfullName']+" to Prerak - "+prerakName+" mapped succesfully.")
              })
            }
           else{
            this.errmsg.push("AG - "+ag+" has no data")
           }
          })
      }

    })
  }


}

