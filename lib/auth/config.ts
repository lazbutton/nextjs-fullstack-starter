/**
 * NextAuth configuration
 * This file sets up NextAuth for authentication
 */

import { createClient } from '@/lib/neon/server'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { ensureProfileExists } from '@/lib/database/profiles'
import { DEFAULT_ROLE } from './roles'
import bcrypt from 'bcryptjs'

export const authConfig = {
  // Using JWT strategy instead of database adapter for simplicity
  // The adapter can be added later if needed
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing credentials')
            throw new Error('Email and password are required')
          }

          // Get user from database
          const sql = createClient()
          const profileResult = await sql`
            SELECT * FROM profiles WHERE email = ${credentials.email} LIMIT 1
          `

          if (!profileResult || (Array.isArray(profileResult) && profileResult.length === 0)) {
            console.error('Profile not found for email:', credentials.email)
            throw new Error('Invalid email or password')
          }

          const profileRows = Array.isArray(profileResult) ? profileResult : [profileResult]
          const profile = profileRows[0] as { id: string; email: string; full_name?: string | null; avatar_url?: string | null }

          // Get password hash
          const passwordResult = await sql`
            SELECT password_hash FROM user_passwords WHERE user_id = ${profile.id} LIMIT 1
          `

          if (!passwordResult || (Array.isArray(passwordResult) && passwordResult.length === 0)) {
            console.error('Password not found for user:', profile.id)
            throw new Error('Invalid email or password')
          }

          const passwordRows = Array.isArray(passwordResult) ? passwordResult : [passwordResult]
          const passwordHash = (passwordRows[0] as { password_hash: string } | undefined)?.password_hash

          if (!passwordHash || typeof passwordHash !== 'string') {
            console.error('Invalid password hash for user:', profile.id)
            throw new Error('Invalid email or password')
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password as string, passwordHash)

          if (!isValid) {
            console.error('Password verification failed for user:', profile.id)
            throw new Error('Invalid email or password')
          }

          return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            image: profile.avatar_url,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          // Return null to trigger CredentialsSignin error
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (user?.id && user?.email) {
        // Ensure profile exists when user signs in
        const profile = await ensureProfileExists(
          user.id,
          user.email,
          user.name || undefined
        )
        if (!profile) {
          console.error('Failed to ensure profile exists for user:', user.id)
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        // Get user role from profile
        const sql = createClient()
        const result = await sql`
          SELECT role FROM profiles WHERE id = ${token.sub} LIMIT 1
        `
        if (result && (Array.isArray(result) ? result.length > 0 : true)) {
          const rows = Array.isArray(result) ? result : [result]
          const profileRow = rows[0] as { role?: string } | undefined
          session.user.role = (profileRow?.role as typeof DEFAULT_ROLE) || DEFAULT_ROLE
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig
