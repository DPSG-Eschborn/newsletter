import { NextResponse } from 'next/server';
import { getSubscribers } from '@/lib/db';

export async function GET() {
  try {
    const list = getSubscribers();
    // Um Datenlecks zu unterbinden, niemals die Liste selbst herausgeben, 
    // sondern exklusiv die absolute Zahl für das UI.
    return NextResponse.json({ count: list.length }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
