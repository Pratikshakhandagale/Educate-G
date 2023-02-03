import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general/general.service';
export class CsvData {
  public ag: any;
  public status: any;
  public number: any;
}
@Component({
  selector: 'app-update-registrations',
  templateUrl: './update-registrations.component.html',
  styleUrls: ['./update-registrations.component.scss']
})
export class UpdateRegistrationsComponent implements OnInit {
  name = 'Update AG Registration';
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  jsondatadisplay:any;
  constructor(private formBuilder: FormBuilder,public generalService: GeneralService,public router: Router) { }

  ngOnInit() {
    if(!localStorage.getItem('isAdminEntity')){
      this.router.navigate(['/login'])
    }
  }

  // onChanges(): void {
  //   this.form.valueChanges.subscribe(value => {
  //     console.log('form input value', value);
  //   });

  //   this.form2.valueChanges.subscribe( value => {
  //     console.log(value);
  //   })
  // }

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CsvData = new CsvData();
        csvRecord.ag = curruntRecord[0].trim();
        csvRecord.status = curruntRecord[1].trim();
        csvRecord.number = curruntRecord[2].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

//check etension
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsondatadisplay = '';
  }

  getJsonData(){
    this.jsondatadisplay = JSON.stringify(this.records);
  }

  submit(){
    for (const ag of this.records) {
      console.log(ag);
      this.generalService
        .postData('AGV8/search', {
          "filters": {
              "osid": {
                  "contains": ag['ag'].trim()
              }
          }
      })
        .subscribe((res2) => {
          console.log("res2",res2);
          if(res2[0]){
            res2[0]["registrationStatus"]= ag['status'];
            this.generalService.putData('AGV8',ag['ag'],res2[0]).subscribe((res3) => {
              console.log("status updated",res3);
            })
            if(res2[0]["AgRegistrationForm"] && ag['number']){
              res2[0]["AgRegistrationForm"][0]["RSOS_NIOSRegId"] = ag['number'];
              this.generalService.putData('AGV8/'+ag['ag']+'/AgRegistrationForm',res2[0]["AgRegistrationForm"][0]["osid"],res2[0]["AgRegistrationForm"][0]).subscribe((res3) => {
                console.log("number updated",res3);
              })
            }
          }
        })
    }
    window.location.reload();
  }
}
