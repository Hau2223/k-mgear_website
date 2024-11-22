import {
    get,
    post, put, del
} from '../utils/axios';

export const createCart = async (params) => {
    return await post('/cart/create', {
        idUser: params.idUser, 
        idProduct: params.idProduct, 
        amount: params.amount, 
        status: params.status
    });
}

export const updateCart = async (params, id) => {
    return await put(`/cart/update/${id}`, {
        idUser: params.idUser, 
        idProduct: params.idProduct, 
        amount: params.amount, 
        status: params.status
    });
}



export const getAllCart = async () => {
    return await get('/cart/getAll');
}

export const getCartByIdUserStatus = async (params) => {
    return await get(`/cart/getByIdUserStatus/${params.idUser}/${params.status}`);
}

export const deleteCart = async (id) => {
    return await del(`/cart/delete/${id}`);
}

