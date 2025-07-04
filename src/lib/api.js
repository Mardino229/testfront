import axios from "axios";

export const fetchOrders = async (pageIndex, pageSize) => {

    const response = await axios.get('http://localhost:3500/api/orders', {
        params: {
            page: pageIndex + 1, // si ton API commence à 1
            limit: parseInt(pageSize),
        },
    });
    console.log(response.data.data);
    return {
        data: response.data.data,
        totalCount: response.data.total,
        total: response.data.totalPages,
    };
}

export const fetchBtcRate = async () => {
    const response = await axios.get('http://localhost:3500/api/rates/BTC/USD');
    console.log(response.data.lastOrders);
    return response.data.lastOrders;
}

export const postOrder = async (order) => {
    console.log(order)
    const response = await axios.post('http://localhost:3500/api/orders', {...order, pair: "BTC/USD"})
    return response.data.data
}