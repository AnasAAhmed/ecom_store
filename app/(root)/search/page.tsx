import ProductCard from '@/components/ProductCard';
import PaginationControls from '@/components/PaginationControls';
import { getSearchProducts } from '@/lib/actions/actions';
import type { Metadata } from 'next';

export const metadata: Metadata= {
  title: "Borcelle | Shop",
  description: "Borcelle Shop where you can search all products",
};

const SearchPage = async ({ searchParams }: { searchParams: any }) => {
  const query = (searchParams?.query as string) || '';
  let page = Number(searchParams?.page) || 1;

  const data = await getSearchProducts(query, page);
  return (
    <div className='px-10 py-5 '>
      {query && <p className='text-heading3-bold my-10'>Search results for {query}</p>}
      <div className='min-h-[80vh]'>

        {data.totalProducts > 0 ? (
          <div className='flex mt-12 flex-wrap justify-center gap-16'>
            {data.products.map((product: ProductType) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className='text-body-bold my-5'>No result found</p>
        )}
      </div>
      <PaginationControls currentPage={page} totalPages={data.totalPages} />
    </div>
  );
};

export default SearchPage;
