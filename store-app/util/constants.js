const COLLECTIONS = {
  PRODUCTS: 'products',
  USERS: 'users',
  ORDERS: 'orders'
};

const { PORT, BASE_URL } = process.env;

module.exports = { COLLECTIONS, BASE_URL, PORT };
