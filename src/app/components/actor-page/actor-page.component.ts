import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Movie } from 'src/app/models/movie.model';
import { ActorService } from 'src/app/services/actor.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-actor-page',
  templateUrl: './actor-page.component.html',
  styleUrls: ['./actor-page.component.css']
})
export class ActorPageComponent implements OnInit {
  actorId;
  actor: Actor;
  movies: Movie[];
  constructor(private route: ActivatedRoute, private actorService: ActorService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.actorId = this.route.snapshot.paramMap.get('id');
    this.actorService.getActor(this.actorId as number).subscribe(actor => {
      this.actor = actor;

      this.movieService.getMoviesByActorId(this.actorId).subscribe((movies) => {
        this.movies = movies;
      });
    });
  }

}
