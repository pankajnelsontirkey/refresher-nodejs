const COLLECTIONS = {
  PRODUCTS: 'products',
  USERS: 'users',
  ORDERS: 'orders'
};

const ITEMS_PER_PAGE = 2;

const { PORT, BASE_URL } = process.env;

module.exports = { COLLECTIONS, BASE_URL, PORT, ITEMS_PER_PAGE };
