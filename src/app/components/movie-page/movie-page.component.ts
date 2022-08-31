import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Actor } from 'src/app/models/actor.model';
import { ActorService } from 'src/app/services/actor.service';
import { Review } from 'src/app/models/review.model';
import { ReviewService } from 'src/app/services/review.service';



@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.css']
})
export class MoviePageComponent implements OnInit {
  movie: Movie;
  movieId;
  rating: number;
  actors: Actor[];
  reviews: Review[];

  toggleViewReviews: boolean = false;
  constructor(private route: ActivatedRoute, private movieService: MovieService, private router: Router) { }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    // this.movieId = this.route.paramMap.subscribe((params: ParamMap) => {
    //   this.movieId = params.get("id");
    // })

    this.movieService.getMovie(this.movieId as number).subscribe(movie=> {
      this.movie = movie;
      console.log(this.movie);
      this.actors = this.movie.actors;
      this.reviews = this.movie.reviews;

      //calculate average rating
      let totalRating: number = 0;
      this.movie.reviews.forEach((review) => totalRating += review.rating)
      this.rating =(totalRating/this.movie.reviews.length);
    })

    
  }

  toggleReviews() {
    this.toggleViewReviews = !this.toggleViewReviews;
  }

  openActorPage(actor: Actor) {
    this.router.navigate(['actor', actor.actorId]);
  }

}
