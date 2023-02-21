import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  baseUrl = "http://netflicksbackend-env.eba-sgzsyqmb.ap-southeast-1.elasticbeanstalk.com/actor"
  constructor(private httpClient: HttpClient) { }

  getActorsByMovieId(movie: Movie) {
    return this.httpClient.get<Actor[]>(this.baseUrl+"/get/" + movie.movieId);
  }

  getActor(actorId: number) {
    return this.httpClient.get<Actor>(this.baseUrl+"/get/" + actorId);
  }

  getAllActors() {
    console.log("trying to get all actors")
    return this.httpClient.get<Actor[]>(this.baseUrl+"/get/all");
  }

  addNewActorToExistingMovie(movieId: number, actorToAdd: Actor) {
    return this.httpClient.put<Actor>(this.baseUrl+"/addNewActor/"+`${movieId}`, actorToAdd);
  }

  addExistingActorToExistingMovie(movieToAdd: Movie, actorToAdd: Actor) {
    return this.httpClient.put<Actor>(this.baseUrl+"/addExistingActor"+`?actorId=${actorToAdd.actorId}&movieId=${movieToAdd.movieId}`, null);
  }

  editActor(actorIdToEdit, editedActor) {
    console.log(actorIdToEdit, editedActor)
    return this.httpClient.put<Actor>(this.baseUrl+"/edit/"+actorIdToEdit, editedActor);
  }

  deleteActor(actorToDelete: Actor) {
    return this.httpClient.delete<Actor>(this.baseUrl+"/delete/"+actorToDelete.actorId);
  }
}
