import Link from 'next/link'

import { AuthForm } from './components/AuthForm'

export default function Home() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="flex w-full flex-col justify-center space-y-6 py-6 sm:w-[350px]">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Realtime Chat
        </h1>
        <AuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
