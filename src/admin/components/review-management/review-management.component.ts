import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';
import { Review } from 'src/app/models/review.model';
import { MovieService } from 'src/app/services/movie.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review-management',
  templateUrl: './review-management.component.html',
  styleUrls: ['./review-management.component.css']
})
export class ReviewManagementComponent implements OnInit {

  reviews: Review[] =[];
  movies: Movie[] = [];
  reviewsLength: number;
  toggleEdit: boolean[];
  addFormHidden: boolean = true;
  addFormSubmitted: boolean = false;
  editFormHidden: boolean = true;
  editFormSubmitted: boolean = false;

  reviewToEdit: Review;
  reviewIndex: number; //to change frontend after edit

  editForm: FormGroup;
  addForm: FormGroup;
  searchForm: FormGroup;

  //pagination
  p: number = 1;

  constructor(private reviewService: ReviewService,private movieService: MovieService, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.reviewService.getReviews().subscribe(data => {
      this.reviews = data;
      this.toggleEdit = Array.apply(false, Array(this.reviews.length as number));
      this.reviewsLength = this.reviews.length;
    });

    this.editForm = this.formBuilder.group({
      dateOfReview: ["", [Validators.required]],
      reviewAuthor: ["", [Validators.required]],
      rating: ["Ex: 4.3", [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9])?$/), Validators.max(5), Validators.min(0)]],
      reviewContent: ["", [Validators.required]],
    })

    this.addForm = this.formBuilder.group({
      movieId: ["", [Validators.required]],
      dateOfReview: ["", [Validators.required]],
      reviewAuthor: ["", [Validators.required]],
      rating: ["", [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9])?$/), Validators.max(5), Validators.min(0)]],
      reviewContent: ["", [Validators.required]],
    })

    this.searchForm = this.formBuilder.group({
      searchString: []
    })
    
  }

  toggleAddReviewForm() {
    this.addFormSubmitted = false;
    this.addForm.reset();
    this.addFormHidden = !this.addFormHidden;
    this.movieService.getMovies().subscribe(movies => {this.movies = movies});
  }

  toggleEditReviewForm(reviewToEdit?: Review, index?: number) {
    this.editFormSubmitted=false;
    if (reviewToEdit) {
      this.editForm.controls['reviewAuthor'].setValue(reviewToEdit.reviewAuthor);
      this.editForm.controls['dateOfReview'].setValue(new Date(reviewToEdit.dateOfReview));
      this.editForm.controls['rating'].setValue(reviewToEdit.rating);
      this.editForm.controls['reviewContent'].setValue(reviewToEdit.reviewContent);
      console.log(new Date(reviewToEdit.dateOfReview))
      this.reviewToEdit = reviewToEdit;
      this.reviewIndex = index+((this.p)-1)*10;
      console.log(this.reviewToEdit)
    }
    this.editFormHidden = !this.editFormHidden;
  }

  submitUserEdits(reviewToEdit: Review, index: number) {
    //change in frontend
    // let newReviewName: string = this.editForm.controls['reviewName'].value;
    // let newRentalCost: number = this.editForm.controls['rentalCost'].value;
    // let newYearOfRelease: number = this.editForm.controls['yearOfRelease'].value;
    // let newImgUrl: string = this.editForm.controls['imgUrl'].value;
    // this.reviews[index].movieId = newReviewName;
    // this.reviews[index].rentalCost = newRentalCost;
    // this.reviews[index].yearOfRelease = newYearOfRelease;
    // this.reviews[index].imgUrl = newImgUrl;
   
    // this.reviewService.editReview(reviewToEdit, new Review(reviewToEdit.reviewId, newReviewName, newRentalCost, newYearOfRelease, newImgUrl)).subscribe(data=>console.log(data));

    // //reset row after edit is done
    // this.addEditUserForm(reviewToEdit, index);
    // this.editForm.reset();
  }

  deleteReview(reviewToDelete: Review) {
    // console.log("deleting user "+reviewToDelete.username);
    this.reviewService.deleteReview(reviewToDelete).subscribe(data=>console.log(data));
    this.reviews = this.reviews?.filter((review)=> review != reviewToDelete);
  }

  addNewReview() {
    this.addFormSubmitted = true;
    if(!this.addForm.valid) {
      alert("Error with add form. Check input fields.")
      return;
    }
    this.addFormSubmitted = false;

    console.log("adding new user");
    let newReview: Review;
    let movieId = this.addForm.controls['movieId'].value;
    console.log(movieId)
    let newReviewAuthor = this.addForm.controls['reviewAuthor'].value;
    let newDateOfReview = new Date(this.addForm.controls['dateOfReview'].value).toISOString();
    let newRating = this.addForm.controls['rating'].value;
    let newReviewContent = this.addForm.controls['reviewContent'].value;
    console.log(newDateOfReview);
    console.log(typeof(newDateOfReview));
    newReview = new Review(this.reviewToEdit, newDateOfReview, newReviewAuthor, newRating, newReviewContent, movieId)
    this.reviewService.addReview(movieId as number, newReview).subscribe(reviewAdded=>{
      console.log(reviewAdded)
       //reset form
      this.addForm.reset();
      //update in front-end
      this.reviews.push(reviewAdded);
      //close pop-up form
      this.addFormHidden = !this.addFormHidden;
    });
    
   
    
  }

  saveEditedReview() {
    this.editFormSubmitted=true;

    if(!this.editForm.valid) {
      alert("Error with edit form fields. Check form fields.")
      return;
    }
    this.editFormSubmitted=false;
    
    console.log("saving edited review form")
    let newReview: Review;
    let newReviewAuthor = this.editForm.controls['reviewAuthor'].value
    let newDateOfReview = this.editForm.controls['dateOfReview'].value
    let newRating = this.editForm.controls['rating'].value
    let newReviewContent = this.editForm.controls['reviewContent'].value
    console.log(newDateOfReview)
    // reviewId?, dateOfReview?, reviewAuthor?, rating?, reviewContent?, mr_fk?
    newReview = new Review(this.reviewToEdit.reviewId, newDateOfReview, newReviewAuthor, newRating, newReviewContent, null);
    this.reviewService.editReview(this.reviewToEdit.reviewId, newReview).subscribe(review => {
      this.reviews[this.reviewIndex] = review; //change review on the frontend without refreshing
      this.editForm.reset();
      this.editFormHidden = !this.editFormHidden;
    });
    
  }

  openMoviePage(review: Review) {
    this.movieService.getMovieByReviewId(review.reviewId).subscribe((movie) => {
      this.router.navigate(['movie', movie.movieId])
    });
  }


}
