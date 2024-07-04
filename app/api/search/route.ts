import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 12;

  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    });

    const totalPages = Math.ceil(totalProducts / limit);

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .select('-reviews -description')
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      products: searchedProducts,
      totalPages,
    });
  } catch (err) {
    console.error('[search_GET]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
