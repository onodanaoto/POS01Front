import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: '商品コードが必要です' }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/search?code=${code}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.detail || '商品の検索に失敗しました' }, { status: response.status });
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Product search error:', error);
    return NextResponse.json({ error: '商品の検索中にエラーが発生しました' }, { status: 500 });
  }
} 