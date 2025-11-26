'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '@/lib/emails'
import type { ApiResponse } from '@/types'

export async function signUp(formData: FormData): Promise<ApiResponse<{ email: string }>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters',
    }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (data.user) {
      // Send welcome email (user may need to verify email first depending on Supabase settings)
      await sendWelcomeEmail(email)

      // Send verification email if email confirmation is enabled
      // Note: Supabase may send this automatically, but we can trigger it manually if needed
      if (data.user.email && !data.session) {
        await sendVerificationEmail(email)
      }
    }

    return {
      success: true,
      data: { email },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during sign up',
    }
  }
}

export async function signIn(formData: FormData): Promise<ApiResponse<{ email: string }>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (data.user) {
      revalidatePath('/', 'layout')
      redirect('/')
    }

    return {
      success: false,
      error: 'Sign in failed',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during sign in',
    }
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/sign-in')
}

export async function resetPassword(formData: FormData): Promise<ApiResponse<{ email: string }>> {
  const email = formData.get('email') as string

  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Send password reset email
    await sendPasswordResetEmail(email)

    return {
      success: true,
      data: { email },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during password reset',
    }
  }
}

export async function updatePassword(formData: FormData): Promise<ApiResponse<void>> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return {
      success: false,
      error: 'Password and confirmation are required',
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters',
    }
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match',
    }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during password update',
    }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

