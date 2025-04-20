import { Component, inject, OnInit } from '@angular/core';
import { DoctormemberService } from '../_services/doctormember.service';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { environment } from '../../environments/environment';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgClass , NgFor , NgIf , NgStyle , FileUploadModule , DecimalPipe ],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent  implements OnInit {
  constructor(public accountservice :AccountdoctorService ,  private router : Router ,  public doctormemberService: DoctormemberService) { }
 
  ngOnInit(): void {
    this.initializeUploader();

  }
  
  uploader?:FileUploader;
  hasBaseDropZoneOver=false;
  baseUrl=environment.apiUrl; 
  
  fileOverBase(e:any){
    this.hasBaseDropZoneOver=e;
  }

     initializeUploader(){
    this.uploader=new FileUploader({
      url:this.baseUrl+`doctor/add-photo/${this.accountservice.currentDoctor()?.id}`,
      authToken : 'Bearer '+ this.accountservice.currentDoctor()?.token , 
      isHTML5:true , 
      allowedFileType: ['image'] , 
      removeAfterUpload : true , 
      autoUpload : false , 
      maxFileSize : 10*1024*1024 
    });

    this.uploader.onAfterAddingFile=(file)=>{
      if (this.uploader!.queue.length > 1) {
        this.uploader!.removeFromQueue(file); 
      }
      file.withCredentials=false
    }
    this.uploader.onSuccessItem=(item , response , status , headers)=>{
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(["/editdoctor"]);
    }); 
    
    }
  }
}
