import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Movie } from 'src/app/models/movie.model';
import { ActorService } from 'src/app/services/actor.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-management',
  templateUrl: './movie-management.component.html',
  styleUrls: ['./movie-management.component.css']
})
export class MovieManagementComponent implements OnInit {

  movies: Movie[] =[];
  actors: Actor[] = [];
  moviesLength: number;
  toggleEdit: boolean[];
  addFormHidden: boolean = true;

  editForm: FormGroup;
  addForm: FormGroup;
  searchForm: FormGroup;

  addFormSubmitted: boolean = false;

  //pagination
  p: number = 1;

  constructor(private movieService: MovieService, private actorService: ActorService, private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.toggleEdit = Array.apply(false, Array(this.movies.length as number));
      this.moviesLength = this.movies.length;
    });

    this.actorService.getAllActors().subscribe(actors => {
      this.actors = actors;
    })

    this.editForm = this.formBuilder.group({
      movieName: [],
      rentalCost: ["", [Validators.pattern("^\[0-9]+(\.[0-9][0-9])?$")]],
      yearOfRelease: ["", [Validators.max(2022), Validators.min(1900)]],
      imgUrl: [],
    })

    this.addForm = this.formBuilder.group({
      movieName: ["", Validators.required],
      rentalCost: ["", [Validators.required, Validators.pattern("^\[0-9]+(\.[0-9][0-9])?$")]],
      yearOfRelease: ["", [Validators.required, Validators.max(2022), Validators.min(1900), Validators.pattern("[0-9]+")]],
      imgUrl: ["", Validators.required],
      actors: [],
    })

    this.searchForm = this.formBuilder.group({
      searchString: []
    })

    if(this.moviesLength==0) {
      console.log("movies length = 0, adding fake movies")
      this.addFakeMovies();
    }
    
  }

  addEditUserForm(movieToEdit: Movie, index: number) {
    // this.toggleEdit = Array.apply(false, Array(this.movies.length as number));
    let indexCurrEditted = this.toggleEdit.findIndex((index) => index==true);

    if(!this.toggleEdit.includes(true)) {
      this.toggleEdit[index] = !this.toggleEdit[index];
      this.editForm.controls['movieName'].setValue(movieToEdit.movieName);
      this.editForm.controls['rentalCost'].setValue(movieToEdit.rentalCost);
      this.editForm.controls['yearOfRelease'].setValue(movieToEdit.yearOfRelease);
      this.editForm.controls['imgUrl'].setValue(movieToEdit.imgUrl);
    }
    else if (index != indexCurrEditted){
      this.toggleEdit[indexCurrEditted] = !this.toggleEdit[indexCurrEditted];
      this.toggleEdit[index] = !this.toggleEdit[index];
      this.editForm.controls['movieName'].setValue(movieToEdit.movieName);
      this.editForm.controls['rentalCost'].setValue(movieToEdit.rentalCost);
      this.editForm.controls['yearOfRelease'].setValue(movieToEdit.yearOfRelease);
      this.editForm.controls['imgUrl'].setValue(movieToEdit.imgUrl);
    }
    else {
      this.toggleEdit[index] = !this.toggleEdit[index];
      this.editForm.controls['movieName'].setValue(movieToEdit.movieName);
      this.editForm.controls['rentalCost'].setValue(movieToEdit.rentalCost);
      this.editForm.controls['yearOfRelease'].setValue(movieToEdit.yearOfRelease);
      this.editForm.controls['imgUrl'].setValue(movieToEdit.imgUrl);
    }
    
  }

  toggleAddMovieForm() {
    this.addFormHidden = !this.addFormHidden;
  }

  submitUserEdits(movieToEdit: Movie, index: number) {
    if(!this.editForm.valid) {
      alert("Edit form invalid. Check input fields.");
      console.log(this.editForm.errors)
      return;
    }

    //change in frontend
    //edit index due to pagination (page number - 1 * 10)
    index += (this.p-1)*10;
    let newMovieName: string = this.editForm.controls['movieName'].value;
    let newRentalCost: number = this.editForm.controls['rentalCost'].value;
    let newYearOfRelease: number = this.editForm.controls['yearOfRelease'].value;
    let newImgUrl: string = this.editForm.controls['imgUrl'].value;
    this.movies[index].movieName = newMovieName;
    this.movies[index].rentalCost = newRentalCost;
    this.movies[index].yearOfRelease = newYearOfRelease;
    this.movies[index].imgUrl = newImgUrl;
    console.log(movieToEdit);
    this.movieService.editMovie(movieToEdit, new Movie(movieToEdit.movieId, newMovieName, newRentalCost, newYearOfRelease, newImgUrl)).subscribe(data=>console.log(data));

    //reset row after edit is done
    this.addEditUserForm(movieToEdit, index);
    this.editForm.reset();
  }

  deleteMovie(movieToDelete: Movie) {
    // console.log("deleting user "+movieToDelete.username);
    this.movieService.deleteMovie(movieToDelete).subscribe(data=>console.log(data));
    this.movies = this.movies?.filter((movie)=> movie != movieToDelete);
  }

  addNewMovie() {
    this.addFormSubmitted = true;

    if(!this.addForm.valid) {
      alert("Add form fields invalid. Check input fields.")
      return;
    }

    this.addFormSubmitted = false;
    console.log("adding new user");
    //retrieving data from add form
    let newMovieName: string = this.addForm.controls['movieName'].value;
    let newRentalCost: number = this.addForm.controls['rentalCost'].value;
    let newYearOfRelease: number = this.addForm.controls['yearOfRelease'].value;
    let newImgUrl: string = this.addForm.controls['imgUrl'].value;
    let actorsToAdd: Actor[];
    
    if (this.addForm.controls['actors'].value ===null) {
      actorsToAdd = null;
    }
    else {
      actorsToAdd= this.addForm.controls['actors'].value;
    }

    //creating movie object
    let movieToAdd: Movie = new Movie(undefined, newMovieName, newRentalCost, newYearOfRelease, newImgUrl, null, actorsToAdd);
    

    console.log(actorsToAdd);
    this.movieService.addMovie(movieToAdd).subscribe(
      movieToAdd=> {
        console.log(movieToAdd)
        //update in front-end
        this.movies.push(movieToAdd);
        //reset form
        this.addForm.reset();
        //close pop-up form
        this.toggleAddMovieForm();
      }
      );    
  }

  submitMovieSearch() {
    let searchString: string = this.searchForm.controls['searchString'].value

    //check that the search string is valid and not empty
    if(searchString === null) {
      this.movieService.getMovies().subscribe(data => {
        this.movies = data;
        this.toggleEdit = Array.apply(false, Array(this.movies.length as number));
        this.moviesLength = this.movies.length;
      });
      return 
    }
    
    //get filtered movie list
    this.movieService.searchMovie(this.searchForm.controls['searchString'].value)
    .then(filteredMovies => { 
      this.movies = filteredMovies;
      this.moviesLength = this.movies.length;
      this.searchForm.reset();
    });

    //navigate to first page
    this.p = 1;
  }

  addFakeMovies() {
    this.movieService.addFakeMovies();
  }

  openMoviePage(movieId: number) {
    this.router.navigate(['movie', movieId]);
  }

}
