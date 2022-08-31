import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Movie } from 'src/app/models/movie.model';
import { ActorService } from 'src/app/services/actor.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-actor-managment',
  templateUrl: './actor-managment.component.html',
  styleUrls: ['./actor-managment.component.css']
})
export class ActorManagmentComponent implements OnInit {

  actors: Actor[] =[];
  movies: Movie[] = [];
  actorsLength: number;
  toggleEdit: boolean[];
  addFormHidden: boolean = true;
  addFormSubmitted: boolean = false;
  editFormHidden: boolean = true;
  addExistingActorFormHidden: boolean = true;
  actorExistsInMovieError: boolean = false;
  

  actorToEdit: Actor;
  actorIndex: number; //to change frontend after edit\
  
  existingActorToAdd: Actor;

  editForm: FormGroup;
  addForm: FormGroup;
  addExistingActorForm: FormGroup;


  //pagination
  p: number = 1;

  constructor(private actorService: ActorService,private movieService: MovieService, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.actorService.getAllActors().subscribe(actors => {
      console.log(actors)
      this.actors = actors;
      this.toggleEdit = Array.apply(false, Array(this.actors.length as number));
      this.actorsLength = this.actors.length;
    });

    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    })

    console.log(this.actors)

    this.editForm = this.formBuilder.group({
      actorFirstName: ["", [Validators.required]],
      actorLastName: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      age: ["", [Validators.required, Validators.max(120), Validators.min(1), Validators.pattern("^[0-9]+$")]],
    })

    this.addForm = this.formBuilder.group({
      movie: ["", [Validators.required]],
      actorFirstName: ["", [Validators.required]],
      actorLastName: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      age: ["", [Validators.required, Validators.max(120), Validators.min(1), Validators.pattern("^[0-9]+$")]],
    })

    this.addExistingActorForm = this.formBuilder.group({
      movieName: ["", [Validators.required]],
    })
    
  }

  toggleAddActorForm() {
    this.addForm.reset();
    this.addFormHidden = !this.addFormHidden;

  }

  toggleEditActorForm(actorToEdit?: Actor, index?: number) {
    if (actorToEdit) {
      this.editForm.controls['actorFirstName'].setValue(actorToEdit.actorFirstName);
      this.editForm.controls['actorLastName'].setValue(actorToEdit.actorLastName);
      this.editForm.controls['gender'].setValue(actorToEdit.gender);
      this.editForm.controls['age'].setValue(actorToEdit.age);

      this.actorToEdit = actorToEdit;
      this.actorIndex = index+((this.p)-1)*10;
    }
    this.editFormHidden = !this.editFormHidden;
  }

  toggleAddExistingActorForm(actorToAdd?: Actor) {
    if (actorToAdd) {
     this.existingActorToAdd = actorToAdd;
    }
    this.addExistingActorFormHidden = !this.addExistingActorFormHidden;
    this.actorExistsInMovieError = false;
  }

  addExistingActor() {
    if(!this.addExistingActorForm.valid) {
      alert("error with form fields. Check form fields")
      return;
    }

    let movieToAddTo: Movie = this.addExistingActorForm.controls['movieName'].value;
    this.actorService.addExistingActorToExistingMovie(movieToAddTo, this.existingActorToAdd).subscribe(
      actorAdded  => { 
        console.log(actorAdded)
        this.addExistingActorForm.reset();
        this.toggleAddExistingActorForm();
      },

      error => {
        if(error['status'] === 304) {
          this.actorExistsInMovieError = true;
        }
        else if (error['status'] === 404) {
          alert("either actor or movie does not exist");
        }
        else {
          console.log(error);
        }
      }
    );

  }

  deleteActor(actorToDelete: Actor) {
    // console.log("deleting user "+actorToDelete.username);
    this.actorService.deleteActor(actorToDelete).subscribe(data=>console.log(data));
    this.actors = this.actors?.filter((actor)=> actor != actorToDelete);
  }

  addNewActor() {
    this.addFormSubmitted = true;
    if(!this.addForm.valid) {
      alert("add form invalid")
      return;
    }
    console.log("adding new user");
    
    //create new actor object
    let newActor: Actor;
    let movie: Movie = this.addForm.controls['movie'].value;
    console.log(movie)
    let newActorFirstName = this.addForm.controls['actorFirstName'].value;
    let newActorLastName = this.addForm.controls['actorLastName'].value;
    let newGender = this.addForm.controls['gender'].value;
    let newAge = this.addForm.controls['age'].value;
    newActor = new Actor(null, newActorFirstName, newActorLastName, newGender, newAge);

    //add new actor to certain movie id
    this.actorService.addNewActorToExistingMovie(movie.movieId as number, newActor).subscribe(actorAdded=>{
      console.log(actorAdded)
       //reset form
      this.addForm.reset();

      this.actorService.getAllActors().subscribe(data => {
        this.actors = data;
        this.toggleEdit = Array.apply(false, Array(this.actors.length as number));
        this.actorsLength = this.actors.length;
      });
      //close pop-up form
      this.addFormHidden = !this.addFormHidden;
    });
    
   
    
  }

  saveEditedActor() {
    if(!this.editForm.valid) {
      alert("Error with edit actor form")
      return;
    }

    console.log("saving edited actor form")
    let newActor: Actor;
    let newActorFirstName = this.editForm.controls['actorFirstName'].value;
    let newActorLastName = this.editForm.controls['actorLastName'].value;
    let newGender = this.editForm.controls['gender'].value;
    let newAge = this.editForm.controls['age'].value;
  
    newActor = new Actor(this.actorToEdit.actorId, newActorFirstName, newActorLastName, newGender, newAge)
    console.log(newActorFirstName, newActorLastName, newGender, newAge);
    console.log(newActor);
    this.actorService.editActor(this.actorToEdit.actorId, newActor).subscribe((actorEdited) => {
      console.log(actorEdited)
      this.actors[this.actorIndex] = actorEdited; //change actor on the frontend without refreshing
      this.editForm.reset();
      this.editFormHidden = !this.editFormHidden;
      
    });
    
  }

  openActorPage(actorId: number) {
    this.router.navigate(['actor', actorId]);
  }

}
