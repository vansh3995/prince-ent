import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { AuthOptions } from "next-auth"

// Extend the built-in session types for NextAuth only
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      userRole?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    userRole?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    userRole?: string
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const { db } = await connectToDatabase()
          
          // Find user in database
          const user = await db.collection('users').findOne({ email: credentials.email })
          
          if (!user) {
            return null
          }

          // Check password
          const isValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValid) {
            return null
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            userRole: user.role || 'user'
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: any }) => {
      if (user) {
        token.id = user.id
        token.userRole = user.userRole
      }
      return token
    },
    session: async ({ session, token }: { session: any; token: JWT }) => {
      if (session.user) {
        session.user.id = token.id
        session.user.userRole = token.userRole
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }