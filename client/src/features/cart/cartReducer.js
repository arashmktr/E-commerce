const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

export const cartReducer = (items, action) => {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action;
      const existing = items.find((item) => item.productId === product._id);

      if (existing) {
        return items.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                price: product.finalPrice,
                stock: product.stock,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        );
      }

      return [
        ...items,
        {
          productId: product._id,
          title: product.title,
          image: product.images?.[0] || '',
          price: product.finalPrice,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    }

    case 'SET_QUANTITY':
      return items.map((item) =>
        item.productId === action.productId
          ? { ...item, quantity: clamp(action.quantity, 1, item.stock) }
          : item,
      );

    case 'REMOVE':
      return items.filter((item) => item.productId !== action.productId);

    case 'CLEAR':
      return [];

    default:
      return items;
  }
};
