import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user'
    
    const logs = await prisma.sleepLog.findMany({
      where: { userId },
      orderBy: { bedTime: 'desc' },
      take: 100,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Failed to fetch sleep logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user'
    const body = await request.json()

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@sleeptracker.app`,
      },
    })

    const log = await prisma.sleepLog.create({
      data: {
        id: body.id,
        userId,
        bedTime: new Date(body.bedTime),
        wakeTime: new Date(body.wakeTime),
        quality: body.quality,
        notes: body.notes || null,
        duration: body.duration,
        sleepScore: body.sleepScore,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('Failed to create sleep log:', error)
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}
