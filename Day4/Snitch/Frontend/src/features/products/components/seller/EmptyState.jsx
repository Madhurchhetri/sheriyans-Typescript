const EmptyState = ({ onClick }) => {
  return (
    <div className="text-center text-gray-400 py-20">
      <p>No Products Found</p>
      <button
        onClick={onClick}
        className="mt-4 bg-yellow-400 px-4 py-2 text-black rounded"
      >
        Add Product
      </button>
    </div>
  );
};

export default EmptyState;