import { NextRequest, NextResponse } from 'next/server';
import { getAfbeeldingenStore } from '@/lib/blob';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const store = getAfbeeldingenStore();
  const { data, metadata } = await store.getWithMetadata(key.join('/'), { type: 'arrayBuffer' });

  if (!data) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      'Content-Type': (metadata?.contentType as string | undefined) ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
