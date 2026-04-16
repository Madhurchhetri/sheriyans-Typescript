import { useDispatch } from "react-redux";
import { createProduct, getSellerProduct, deleteProduct } from "../service/product.api";
import {
    getSellerProductSuccess,
    deleteProductSuccess,
} from "../state/product.slice";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.product;
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct();
        dispatch(getSellerProductSuccess(data.products));
        return data.products;
    }

    async function handleDeleteProduct(productId) {
        await deleteProduct(productId);
        dispatch(deleteProductSuccess(productId));
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleDeleteProduct,
    };
};