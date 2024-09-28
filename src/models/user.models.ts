export interface LoggedInUser{
    user: User,
    token:string
}

export interface User{
    id:number,
    email:string,
    username:string,
    name:string,
    profileImage:string;
}


