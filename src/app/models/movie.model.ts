import { Actor } from "./actor.model";
import { Review } from "./review.model";

export class Movie {
    movieId?: number;
    movieName?: String;
    rentalCost?: number;
    yearOfRelease?: number;
    imgUrl?: String;
    reviews?: Review[];
    actors?: Actor[];

    constructor(movieId?, movieName?, rentalCost?, yearOfRelease?, imgUrl?, reviews?, actors?) {
        this.movieId = movieId;
        this.movieName = movieName;
        this.rentalCost = rentalCost;
        this.yearOfRelease = yearOfRelease;
        this.imgUrl = imgUrl;
        this.reviews = reviews;
        this.actors = actors;
    }
}