export class Actor{
    actorId?: number;
    actorFirstName?: string;
    actorLastName?: string;
    gender?: string;
    age?: number;

    constructor(actorId?: number, actorFirstName?: string, actorLastName?: string, gender?: string, age?: number) {
        this.actorId=actorId;
        this.actorFirstName = actorFirstName;
        this.actorLastName = actorLastName;
        this.gender = gender;
        this.age = age;
    }
}