import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { Newsletter } from '@/emails/Newsletter';
import * as React from 'react';

export async function POST(req: Request) {
  try {
    const { content, subject, issueNumber } = await req.json();

    const html = await render(React.createElement(Newsletter, { content, subject, issueNumber }));

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to render email.' }, { status: 500 });
  }
}
