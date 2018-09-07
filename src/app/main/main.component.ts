import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../shared/services/book.service';
import { Subscription } from 'rxjs';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Book } from '../shared/models/book.model';




@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    closeResult: string;

    //form data for search 
    public bookControl: FormControl;
    public searchForm: FormGroup;

    //form data for edit or add
    public authorControl: FormControl;
    public publishControl: FormControl;
    public titleControl: FormControl;
    public indexControl: FormControl;
    public bookForm: FormGroup

    //book object for retrieving the data in it
    public book: Book[];
    private subscription: Subscription;

    //hide the add book icon before searching for book
    public hide: Number;
    public valiDate: Number;

    constructor(private bookService: BookService, private modalService: NgbModal) { }

    //function to open the popup for edit or delete
    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    //function for closing the popup for edit or delete
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    ngOnInit() {
        this.hide = 0;
        this.valiDate = 1;
        //init the data 
        this.bookControl = new FormControl("", Validators.required);
        this.searchForm = new FormGroup({
            bookControl: this.bookControl
        });

        //init the edit or add popup data
        this.authorControl = new FormControl("", Validators.required);
        this.publishControl = new FormControl("");//, Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/));
        this.titleControl = new FormControl("", Validators.required);
        this.indexControl = new FormControl("");

        this.bookForm = new FormGroup({
            authorControl: this.authorControl,
            publishControl: this.publishControl,
            titleControl: this.titleControl,
            indexControl: this.indexControl
        });
    }

    //search button function - retrieving data from the service to the book object
    public search() {
        this.subscription = this.bookService.getBooksAsync(this.bookControl.value)
            .subscribe(
                data => {
                    this.book = new Array(data.items.length);
                    for (let i = 0; i < data.items.length; i++) {
                        this.book[i] = data.items[i].volumeInfo;
                    }
                },
                error => {
                    alert(error);
                }
            )
        //after filling the table we must show the add book icon 
        this.hide = 1;
    }

    //clicking the edit icon will open the popup and fill the fields with the book values
    public editBook(content1, b, i) {
        this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title' });
        this.authorControl.setValue(b.authors);
        this.publishControl.setValue(b.publishedDate);
        this.titleControl.setValue(b.title);
        this.indexControl.setValue(i);
    }

    //clicking the add book icon will open the popup icon
    public addBook(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
        this.authorControl.setValue("");
        this.publishControl.setValue("");
        this.titleControl.setValue("");
    }

    //deleting the book from the table after confirm
    public deleteBook(b) {
        var result = confirm("Are you sure?");
        if (result) {
            this.book.forEach((book, index) => {
                if (book === b) this.book.splice(index, 1);
            });
        }
    }

    //add new book fields to the book array
    public add() {
        if (this.dateCheck(this.publishControl.value)) {
            this.valiDate = 1;
            var obj = new Book(this.titleControl.value, this.authorControl.value, this.publishControl.value);
            this.book.push(obj);
            //clear the data
            this.authorControl.setValue("");
            this.publishControl.setValue("");
            this.titleControl.setValue("");
            this.modalService.dismissAll();
        } else {
            this.valiDate = 0;
        }
    }

    //edit book in this index
    public edit() {
        if (this.dateCheck(this.publishControl.value)) {
            this.valiDate = 1;
            var index = this.indexControl.value;
            this.book[index].authors = this.authorControl.value;
            this.book[index].publishedDate = this.publishControl.value;
            this.book[index].title = this.titleControl.value;
            //clear the data
            this.authorControl.setValue("");
            this.publishControl.setValue("");
            this.titleControl.setValue("");
            this.modalService.dismissAll();
        } else {
            this.valiDate = 0;
        }
    }

    //checking date validation
    public dateCheck(date): boolean {
        if (date.length < 11) {
            if (date.length == 4) {
                if (isNaN(date) || date > 2018) {
                    return false;
                } else {
                    return true;
                }
            }
            if (date.length == 7) {
                var yyyy = date.slice(0, 4);
                var symbole = date.slice(4, 5);
                var mm = date.slice(5, 7);
                if (isNaN(yyyy) || isNaN(mm) || symbole != '-' || yyyy > 2018 || mm > 12) {
                    return false;
                } else {
                    return true;
                }
            }
            if (date.length == 10) {
                var yyyy = date.slice(0, 4);
                var symbole1 = date.slice(4, 5);
                var mm = date.slice(5, 7);
                var symbole2 = date.slice(7, 8);
                var dd = date.slice(8, 10);
                if (isNaN(yyyy) || isNaN(mm) || isNaN(dd) || symbole1 != '-' || symbole2 != '-' || yyyy > 2018 || mm > 12 || dd > 31) {
                    return false;
                } else {
                    return true;
                }
            }
        }
        return false;
    }
}