export class User {
    userId?: number;
    username: String;
    password: String;
    permissions: String = 'user';

    constructor(userId?,username?, password?, permissions?) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        if(permissions) {
            this.permissions = permissions;
        }
    }
}