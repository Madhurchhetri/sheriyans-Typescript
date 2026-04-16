const SkeletonCard = () => {
  return (
    <div className="bg-[#1C1B1B] p-4 rounded-xl animate-pulse">
      <div className="h-40 bg-gray-700 mb-3 rounded"></div>
      <div className="h-4 bg-gray-700 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 rounded"></div>
    </div>
  );
};

export default SkeletonCard;