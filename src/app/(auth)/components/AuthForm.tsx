'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

type AuthFormVariant = 'signIn' | 'signUp'

const authFormSchema = z.object({
  name: z.string().min(0, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'An email is required.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
})

type AuthFormSchema = z.infer<typeof authFormSchema>

export function AuthForm() {
  const [authFormVariant, setAuthFormVariant] =
    React.useState<AuthFormVariant>('signIn')
  const [isLoading, setIsLoading] = React.useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const toogleVariant = React.useCallback(() => {
    if (authFormVariant === 'signIn') {
      setAuthFormVariant('signUp')
    } else {
      setAuthFormVariant('signIn')
    }
  }, [authFormVariant])

  const form = useForm<AuthFormSchema>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function handleGitHubSignIn() {
    const callback = await signIn('github', { redirect: false })

    if (callback?.error) {
      toast({ title: 'Uh oh! Something went wrong.', variant: 'destructive' })
    }
  }

  async function onSubmit(values: AuthFormSchema) {
    setIsLoading(true)

    if (authFormVariant === 'signIn') {
      const callback = await signIn('credentials', {
        ...values,
        redirect: false,
      })

      if (callback?.error) {
        toast({ title: 'Uh oh! Something went wrong.', variant: 'destructive' })
      } else {
        router.push('/users')
        form.reset()
      }
    }

    if (authFormVariant === 'signUp') {
      try {
        await axios.post('/api/register', values)

        await signIn('credentials', values)

        form.reset()
      } catch (err) {
        toast({ title: 'Uh oh! Something went wrong.', variant: 'destructive' })
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          {authFormVariant === 'signUp' && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {authFormVariant === 'signIn' ? 'Sign In' : 'Create account'}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <span>
          {authFormVariant === 'signIn'
            ? "Don't have an account?"
            : 'Have an account?'}
        </span>
        <Button variant="link" onClick={toogleVariant} disabled={isLoading}>
          {authFormVariant === 'signIn' ? 'Sign Up' : 'Sign In'}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGitHubSignIn}
      >
        <Icons.GitHub className="mr-2 h-4 w-4" />
        Github
      </Button>
    </div>
  )
}
