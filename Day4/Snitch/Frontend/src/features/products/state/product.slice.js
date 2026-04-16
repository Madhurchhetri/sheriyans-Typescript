import { createSlice } from "@reduxjs/toolkit";


const productSlice = createSlice({
    name : 'product',
    initialState : { 
        sellerProducts : [],
        loading : false,
        error : null,
    },
    reducers : {
        createProductRequest : (state) => {
            state.loading = true;
        },
        createProductSuccess : (state,action) => {
            state.loading = false;
            state.sellerProducts.push(action.payload);
        },
        createProductFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getSellerProductRequest : (state) => {
            state.loading = true;
        },
        getSellerProductSuccess : (state,action) => {
            state.loading = false;
            state.sellerProducts = action.payload;
        },
        getSellerProductFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteProductSuccess : (state, action) => {
            // action.payload = productId (string)
            state.sellerProducts = state.sellerProducts.filter(
                (p) => p._id !== action.payload
            );
        },
    }
})

export const {
    createProductRequest,
    createProductSuccess,
    createProductFailure,
    getSellerProductRequest,
    getSellerProductSuccess,
    getSellerProductFailure,
    deleteProductSuccess,
} = productSlice.actions;

export default productSlice.reducer;