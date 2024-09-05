"use sever"
import { SessionOptions } from "iron-session";

//get sessionData
export interface SessionData {
    userID?:string;
    ministry?:string;
    firstname?:string;
    lastname?:string;
    email?:string;
    bod?:string;
    contact?:string;
    nationality?:string;
    identifier?:string;
    role?:string;
    img?:string;
    isPro?:boolean;
    isLoggedIn:boolean;
  }
  
export const defaultSession:SessionData = {
    isLoggedIn:false
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: 'lama-session',
    cookieOptions: {
      httpOnly:true,
      secure: process.env.NODE_ENV === "production"
    }
}
  
