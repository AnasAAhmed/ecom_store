'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import PaginationControls from '@/components/PaginationControls';
import Loader from '@/components/Loader';



const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  let page = parseInt(searchParams.get('page') || '1');

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    page = 1
  }, [query]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await fetch(`/api/search?query=${query}&page=${page}`);
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setLoading(false);
    };

    fetchProducts();
  }, [query, page]);


  return (
    <div className='px-10 py-5 '>
      {query && <p className='text-heading3-bold my-10'>Search results for {query}</p>}
      <div className='min-h-[80vh]'>

      {!loading ? products.length === 0 ? (
        <p className='text-body-bold my-5'>No result found</p>
      ) : (
        <div className='flex mt-12 flex-wrap justify-center gap-16'>
          {products.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ):<Loader height={85} />}
      </div>
      <PaginationControls currentPage={page} totalPages={totalPages} />
    </div>
  );
};

export default SearchPage;
