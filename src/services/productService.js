import {
    get,
    post, put, del
} from '../utils/axios';

export const createProduct = async (params) => {
    return await post('/product/create', {
        name: params.name,
        type: params.type,
        price: params.price,
        discount: params.discount,
        quantity: params.quantity,
        brand: params.brand,
        description: params.description,
        rating: params.rating,
        sold: params.sold,
        imageUrl: params.imageUrl,
    });
}

export const updateProduct = async (params, id) => {
    return await put(`/product/update/${id}`, {
        name: params.name,
        type: params.type,
        price: params.price,
        discount: params.discount,
        quantity: params.quantity,
        brand: params.brand,
        description: params.description,
        rating: params.rating,
        sold: params.sold,
        imageUrl: params.imageUrl,
        totalReviews : params.totalReviews
    });
}

export const updateRating = async (params, id) => {
    return await put(`/product/updateRating/${id}`, {
        rating: params.rating,
        totalReviews : params.totalReviews
    });
}

export const deleteProduct = async (id) => {
    return await del(`/product/delete/${id}`);
}

export const getAll = async () => {
    return await get('/product/getAll');
}

export const getProductById = async (id) => {
    return await get(`/product/getById/${id}`);
}

export const getProductByTerm = async (term) => {
    return await get(`/product/getByTerm/${term}`);
}

export const getProductByType = async (type) => {
    return await get(`/product/getByType/${type}`);
}

