import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET as string




// cookies : key : value 

const protectedPages = ['/dashboard','/inventory','/shootings','/apropos']

export async function  middleware(request: NextRequest ){

    const {pathname} = request.nextUrl;
    const token = request.cookies.get('token')?.value;



    const isProtectedRoute = protectedPages.some((route) => pathname.startsWith(route))

    if (isProtectedRoute && !token ){

        return NextResponse.redirect(new URL("/",request.url));

    }


    // petit exercice: 

    // ajout du bcryptjs 
    // generation du token 
    // stockage du token dans la cookie
    

    // middleware : request, response, next 
    return NextResponse.next();


}

export const config = {
    matcher: [
        // on demande a next: voici les routes à considerer
        '/dashboard/:path*',
        '/inventory/:path*',
        '/shootings/:path*',
        '/apropos/:path*'
    ]
}