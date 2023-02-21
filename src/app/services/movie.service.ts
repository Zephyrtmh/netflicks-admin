import { HttpClient } from '@angular/common/http';
import { Injectable, resolveForwardRef } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  baseUrl: String = "http://netflicksbackend-env.eba-sgzsyqmb.ap-southeast-1.elasticbeanstalk.com/movie"

  constructor(private httpClient: HttpClient) { }

  getMovies() {
    return this.httpClient.get<Movie[]>(this.baseUrl + "/get/movies");
  }

  getMovie(movieId: number) {
    return this.httpClient.get<Movie>(this.baseUrl + "/get/"+movieId);
  }

  editMovie(movieToEdit: Movie, newMovie) {
    console.log("editing row")
    return this.httpClient.put<Movie>(this.baseUrl + "/edit/" + movieToEdit.movieId, newMovie);
  }

  deleteMovie(movieToDelete: Movie) {
    return this.httpClient.delete<Movie>(this.baseUrl + "/delete/" + movieToDelete.movieId);
  }

  addMovie(movieToAdd: Movie) {
    return this.httpClient.post<Movie>(this.baseUrl + "/add", movieToAdd);
  }

  addFakeMovies() {
    console.log("fake movies being added")
    return this.httpClient.get(this.baseUrl+"/addFakes").subscribe();
  }

  searchMovie(searchString: string) {
    //get all movies

    let filteredMovies: Movie[];
    let allMovies: Movie[];
    return new Promise<Movie[]>(resolve=>{this.getMovies().subscribe(movies => {
      allMovies = movies;
      console.log(filteredMovies)
      filteredMovies = allMovies.filter(movie=>{ 
        return movie.movieName === searchString;
      })
      resolve(filteredMovies);
    })}
    );
    
  }

  getMoviesByActorId(actorId: number) {
    return this.httpClient.get<Movie[]>(this.baseUrl + `/get/actorId/${actorId}`);
  }

  getMovieByReviewId(reviewId: number) {
    return this.httpClient.get<Movie>(this.baseUrl + `/get/reviewId/${reviewId}`);
  }
}
