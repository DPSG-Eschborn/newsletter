import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { Newsletter } from '@/emails/Newsletter';
import { Resend } from 'resend';
import * as React from 'react';
import { getSubscribers } from '@/lib/db';

// Initialize Resend
// Note: If RESEND_API_KEY is not defined, it will fail to send, but we can catch it.
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function POST(req: Request) {
  try {
    const { subject, content, issueNumber } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: 'Betreff und Inhalt fehlen.' }, { status: 400 });
    }

    const subscribers = getSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'Keine Abonnenten in der Datenbank gefunden.' }, { status: 400 });
    }

    const html = await render(React.createElement(Newsletter, { content, subject, issueNumber }));

    // Wir erstellen für jeden Abonnenten ein eigenes E-Mail-Objekt für den Batch-Versand
    const emailPayloads = subscribers.map(email => ({
      from: 'DPSG Eschborn <newsletter@dpsg-eschborn.de>', // Domain muss bei Resend verifiziert sein
      to: [email],
      subject: subject,
      html: html,
    }));

    // Resend erlaubt max 100 E-Mails pro Batch-Request
    const CHUNK_SIZE = 100;
    const results = [];
    
    for (let i = 0; i < emailPayloads.length; i += CHUNK_SIZE) {
      const batch = emailPayloads.slice(i, i + CHUNK_SIZE);
      const { data, error } = await resend.batch.send(batch);
      
      if (error) {
        console.error("Batch send error:", error);
        return NextResponse.json({ error: error.message || 'Fehler beim Resend Batch Versand' }, { status: 500 });
      }
      results.push(data);
    }

    return NextResponse.json({ success: true, batchesSent: results.length, totalSubscribers: subscribers.length }, { status: 200 });
  } catch (error) {
    console.error("Critical Send Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
