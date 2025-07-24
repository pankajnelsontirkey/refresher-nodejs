const pipeline_UserWithCartWithProductDetailsAndQuantity = (userId) => [
  { $match: { _id: userId } },
  {
    $lookup: {
      from: 'products',
      localField: 'cart.products._id',
      foreignField: '_id',
      as: 'cart.productId'
    }
  },
  {
    $addFields: {
      'cart.products': {
        $map: {
          input: '$cart.productId',
          as: 'pwd',
          in: {
            $mergeObjects: [
              '$$pwd',
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$cart.products',
                      as: 'pds',
                      cond: {
                        $eq: ['$$pwd._id', '$$pds._id']
                      }
                    }
                  },
                  0
                ]
              }
            ]
          }
        }
      }
    }
  },
  { $unset: ['password', 'cart.productId'] }
];
module.exports = {
  pipeline_UserWithCartWithProductDetailsAndQuantity
};
