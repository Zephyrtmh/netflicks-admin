import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  baseUrl: String = "http://http://netflicksbackend-env.eba-sgzsyqmb.ap-southeast-1.elasticbeanstalk.com/review"

  constructor(private httpClient: HttpClient) { }

  getReviews() {
    return this.httpClient.get<Review[]>(this.baseUrl + "/get/all");
  }

  getMovieId(reviewId: number) {
    return this.httpClient.get<number>(this.baseUrl + "/get/movieId/" + reviewId);
  }

  getReviewsByMovieId(movieId: number) {
    console.log("trying to get reviews by movie id")
    return this.httpClient.get<Review[]>(this.baseUrl + "/get/movie/"+movieId);
  }

  editReview(reviewToEdit: number, newReview) {
    console.log("editing row")
    return this.httpClient.put<Review>(this.baseUrl + "/edit/" + reviewToEdit, newReview);
  }

  deleteReview(reviewToDelete: Review) {
    return this.httpClient.delete<Review>(this.baseUrl + "/delete/" + reviewToDelete.reviewId);
  }

  addReview(movieId: number, reviewToAdd: Review) {
    return this.httpClient.put<Review>(this.baseUrl + "/addReview/"+movieId, reviewToAdd);
  }

  addFakeReviews() {
    console.log("fake reviews being added")
    return this.httpClient.get(this.baseUrl+"/addFakes").subscribe();
  }
}
