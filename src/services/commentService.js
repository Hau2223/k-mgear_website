import {
    get,
    put,
    post,
    del
} from '../utils/axios';


export const createComment = async (commentData) => {
    return await post('/comment/create', commentData);
};

export const getAllCommentByID = async (id) => {
    return await get(`/comment/getAllProductId/${id}`);
}


export const updateComment = async (params, id) => {
    return await put(`/comment/update/${id}`, {
        id: params.id, 
        idUser: params.idUser, 
        idProduct: params.idProduct, 
        comment: params.comment,
        rating: params.rating,
        nameUser: params.nameUser
    });

}

export const deleteComment = async (id) => {
    return await del(`/comment/delete/${id}`);
}