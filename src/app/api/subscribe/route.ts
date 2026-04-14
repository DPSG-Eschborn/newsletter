import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Ungültige E-Mail Adresse' }, { status: 400 });
    }

    const success = addSubscriber(email);

    if (!success) {
       return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }

    // Immer 'Erfolgreich' zurückgeben, um DSGVO/Enumeration Angriffe zu vermeiden
    return NextResponse.json({ success: true, message: 'Erfolgreich eingetragen' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Fehlerhafte Anfrage' }, { status: 400 });
  }
}
