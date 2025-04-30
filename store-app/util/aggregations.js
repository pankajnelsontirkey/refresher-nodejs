const { ObjectId } = require('mongodb');

exports.OrdersWithProductDetails = [
  {
    $match: {
      userId: ObjectId.createFromHexString('68113d55d79e63b772f04165')
    }
  },
  {
    $unwind: '$products'
  },
  {
    $lookup: {
      from: 'products',
      localField: 'products.productId',
      foreignField: '_id',
      as: 'productDetails'
    }
  },
  {
    $replaceWith: {
      $mergeObjects: [
        '$$ROOT',
        {
          products: {
            $mergeObjects: [
              {
                productId: '$products.productId'
              },
              {
                quantity: '$products.quantity'
              },
              {
                $arrayElemAt: ['$productDetails', 0]
              }
            ]
          }
        }
      ]
      // }
    }
  },
  {
    $replaceWith: {
      $unsetField: {
        field: 'productDetails',
        input: '$$ROOT'
      }
    }
  },
  {
    $group: {
      _id: '$_id',
      products: {
        $addToSet: '$products'
      }
    }
  }
];
