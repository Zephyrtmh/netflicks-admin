export class Review {
    reviewId?: number;
    dateOfReview?: Date;
    reviewAuthor?: string;
    rating? : number;
    reviewContent?: string;
    mr_fk?: number;
    

    constructor(reviewId?, dateOfReview?, reviewAuthor?, rating?, reviewContent?, mr_fk?) {
        this.reviewId = reviewId;
        this.dateOfReview = new Date(dateOfReview);
        this.reviewAuthor = reviewAuthor;
        this.rating = rating;
        this.reviewContent = reviewContent;
        this.mr_fk = mr_fk
    }
}