// Pagination.jsx
const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  return (
    <div className='flex flex-wrap justify-center mt-4'>
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={`w-10 h-10 font-semibold text-lg m-1 rounded-lg transition-all ${
            page === currentPage 
              ? 'bg-teal-400 text-black font-bold' 
              : 'bg-transparent text-gray-800 dark:text-white'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
