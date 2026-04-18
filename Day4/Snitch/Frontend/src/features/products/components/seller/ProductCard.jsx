import React, { useState } from "react";
import { getPrice, timeAgo } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => {
  const [imgError, setImgError] = useState(false);

  const navigate = useNavigate();

  const resolveUrl = (img) =>
    typeof img === "string" ? img : img?.url ?? null;

  const coverUrl = !imgError ? resolveUrl(product?.images?.[0]) : null;

  const price = getPrice(product);

  return (
    <div 
    onClick={()=>{navigate(`/seller/product/${product._id}`)}}
    className="bg-[#1C1B1B] rounded-2xl overflow-hidden">
      
      {/* Image */}
      <div className="aspect-[4/3] bg-[#131313]">
        {coverUrl ? (
          <img
            src={coverUrl}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2" >
        <h3 className="text-white font-semibold">
          {product.title || "Untitled"}
        </h3>

        <p className="text-sm text-gray-400">
          {product.description?.slice(0, 60)}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-yellow-400 font-bold">
            {price || "No price"}
          </span>

          <span className="text-xs text-gray-500">
            {timeAgo(product.createdAt)}
          </span>
        </div>

        <button
          onClick={() => onDelete(product)}
          className="bg-red-500 text-white text-xs py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;