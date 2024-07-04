'use client';
import { useRouter } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages }) => {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="pagination">
          {totalPages > 1 && (
            <article className="flex justify-center items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-400' : 'bg-violet-500'} text-white rounded mr-2`}
              >
                Prev
              </button>
              <span className="text-base">
              {currentPage}/{totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-400' : 'bg-violet-500'} text-white rounded ml-2`}
              >
                Next
              </button>
            </article>
          )}
    </div>
  );
};

export default PaginationControls;
