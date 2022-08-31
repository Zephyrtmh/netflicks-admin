import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  baseUrl: String = "http://localhost:8080/review"

  constructor(private httpClient: HttpClient) { }

  getReviews() {
    return this.httpClient.get<Review[]>(this.baseUrl + "/get/all");
  }

  editReview(reviewToEdit: Review, newReview) {
    console.log("editing row")
    return this.httpClient.put<Review>(this.baseUrl + "/edit/" + reviewToEdit.reviewId, newReview);
  }

  deleteReview(reviewToDelete: Review) {
    return this.httpClient.delete<Review>(this.baseUrl + "/delete/" + reviewToDelete.reviewId);
  }

  addReview(reviewToAdd: Review) {
    return this.httpClient.post<Review>(this.baseUrl + "/add", reviewToAdd);
  }

  addFakeReviews() {
    console.log("fake reviews being added")
    return this.httpClient.get(this.baseUrl+"/addFakes").subscribe();
  }
}
