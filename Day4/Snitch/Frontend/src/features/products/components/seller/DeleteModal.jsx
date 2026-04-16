const DeleteModal = ({ product, onConfirm, onCancel, deleting }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="bg-[#201F1F] p-6 rounded-xl w-[300px]">
        <h2 className="text-white mb-2">Delete Product?</h2>

        <p className="text-gray-400 text-sm mb-4">
          {product?.title}
        </p>

        <div className="flex gap-2">
          <button onClick={onCancel} className="bg-gray-600 px-3 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 px-3 py-2 rounded"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;