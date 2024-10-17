export interface LoggedInUser{
    user: User,
    token:string
}

export interface User{
    email:string,
    username:string,
    profileImage?:string;
    firstname:string;
    lastname:string;
}


