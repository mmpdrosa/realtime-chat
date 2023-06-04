import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const body = await request.json()

  const { name, email, password } = bodySchema.parse(body)

  if (!name || !email || !password) {
    return NextResponse.json({ error: '' }, { status: 400 })
  }

  const hashedPassword = await hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  })

  return NextResponse.json(user)
}
