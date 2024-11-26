import {
    get,
} from '../utils/axios';


export const getAllCommentByID = async (id) => {
    return await get(`/comment/getAllProductId/${id}`);
}


