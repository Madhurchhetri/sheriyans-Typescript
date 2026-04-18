import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../auth/hook/useAuth";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import ProductCard from "../components/seller/ProductCard";
import SkeletonCard from "../components/seller/SkeletonCard";
import EmptyState from "../components/seller/EmptyState";
import DeleteModal from "../components/seller/DeleteModal";
import Stat from "../components/seller/Stat";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { handleGetSellerProduct, handleDeleteProduct } = useProduct();

    const { sellerProducts, loading } = useSelector((s) => s.product);
    const user = useSelector((s) => s.auth?.user);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { handleGetMe } = useAuth();



    useEffect(() => {
        handleGetSellerProduct();
       
    }, []);

    const confirmDelete = async () => {
        setDeleting(true);
        await handleDeleteProduct(deleteTarget._id);
        setDeleting(false);
        setDeleteTarget(null);
    };

    /* ✅ USER NAME FIX */
    const userName =
        user?.fullname ||
        user?.name ||
        user?.username ||
        "Seller";

    /* ✅ STATS OPTIMIZED */
    const { total, live, draft } = useMemo(() => {
        let live = 0;
        let draft = 0;

        sellerProducts.forEach((p) => {
            if (p.status === "draft") draft++;
            else live++;
        });

        return {
            total: sellerProducts.length,
            live,
            draft,
        };
    }, [sellerProducts]);

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-white">

            {/* 🔥 TOP HEADER */}
            <div className="p-6 border-b border-[#2a2a2a] bg-[#121212] sticky top-0 z-10 backdrop-blur-md">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* 👤 USER INFO */}
                    <div>
                        <h1 className="text-2xl font-bold text-yellow-400">
                            {userName}'s Store
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Manage your products & grow your business 🚀
                        </p>
                    </div>

                    {/* 📊 STATS */}
                    <div className="flex gap-6">
                        <Stat label="Total" value={total} />
                        <Stat label="Live" value={live} accent />
                        <Stat label="Draft" value={draft} />
                    </div>
                </div>
            </div>

            {/* 🔥 MAIN CONTENT */}
            <div className="p-6">

                {/* 🧾 SECTION HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-200">
                        Your Products
                    </h2>

                    <span className="text-sm text-gray-500">
                        {total} items
                    </span>
                </div>

                {/* 📦 CONTENT */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : sellerProducts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {sellerProducts.map((p) => (
                            <div
                                key={p._id}
                                className="transition-transform duration-300 hover:scale-[1.02]"
                            >
                                <ProductCard
                                    product={p}
                                    onDelete={setDeleteTarget}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ❌ DELETE MODAL */}
            {deleteTarget && (
                <DeleteModal
                    product={deleteTarget}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}
            <Link to="/seller/create-product" >
                <div className="flex items-center justify-center h-full bg-yellow-400 w-fit mx-auto rounded px-4 text-black">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                    create new product
                </div>
            </Link>

            {/* <Link
                to="/seller/create-product"
                className="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 w-fit mx-auto"
                style={{
                    background: "#F5C518",
                    color: "#3D2F00",
                }}
            >
                
                Create
            </Link> */}
        </div>
    );
};

export default Dashboard;