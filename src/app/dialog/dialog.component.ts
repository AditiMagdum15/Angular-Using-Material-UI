import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand new", "Second Hand", "Refurbished"]
  productform !: FormGroup
  actionbtn : string ="Save"
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public  editData : any,
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productform = this.formBuilder.group({
      productName : ['', Validators.required],
      category : ['', Validators.required],
      freshness : ['', Validators.required],
      comment : ['', Validators.required],
      price : ['', Validators.required],
      date : ['', Validators.required]
    });

    if(this.editData){
      this.actionbtn="Update";
      this.productform.controls['productName'].setValue(this.editData.productName);
      this.productform.controls['category'].setValue(this.editData.category);
      this.productform.controls['date'].setValue(this.editData.date);
      this.productform.controls['freshness'].setValue(this.editData.freshness);
      this.productform.controls['price'].setValue(this.editData.price);
      this.productform.controls['comment'].setValue(this.editData.comment);
    }
  }

  addProduct(){
    if(!this.editData){
      if(this.productform.valid){
        this.api.postProduct(this.productform.value)
        .subscribe({
          next:(res)=>{
            alert("Product added successfully")
            this.productform.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("error while adding product")
          }
        })
      }
    }
    else{
      this.updateData();
    }
  }

  updateData(){
    this.api.putProduct(this.productform.value, this.editData.id)
    .subscribe({
      next: (res)=>
      {
        alert("Product updated successfully");
        this.productform.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("error while updating the details");
      }
    })

  }
}
