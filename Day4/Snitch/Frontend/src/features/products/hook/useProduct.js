import { useDispatch } from "react-redux";
import { createProduct, getSellerProduct, deleteProduct, getAllProducts ,getProductById } from "../service/product.api";
import {
    getSellerProductSuccess,
    deleteProductSuccess,
    setProducts,
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

    async function handleGetAllProducts(){
        const data = await getAllProducts();
        dispatch(setProducts(data.products))
    }
        

    async function handleDeleteProduct(productId) {
        await deleteProduct(productId);
        dispatch(deleteProductSuccess(productId));
    }

    async function handleGetProductById(productId){
        const data = await getProductById(productId);
        return data.product;
    }
        

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleDeleteProduct,
        handleGetAllProducts,
        handleGetProductById,
    };
};