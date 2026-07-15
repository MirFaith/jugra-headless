import type { AddToCartInput, CartLine, CartState } from '@models/cart';
import type { ShoppegoCheckoutInput } from '@models/shoppego';

const emptyCart = (): CartState => ({
  lines: [],
  updatedAt: new Date().toISOString()
});

export class CartService {
  static createEmptyCart(): CartState {
    return emptyCart();
  }

  static addLine(cart: CartState, input: AddToCartInput): CartState {
    const quantity = Math.max(1, Math.floor(input.quantity || 1));
    const variantId = input.variant.id;
    const existingLine = cart.lines.find((line) => line.variantId === variantId);

    if (existingLine) {
      return {
        lines: cart.lines.map((line) => {
          if (line.variantId !== variantId) return line;
          return { ...line, quantity: line.quantity + quantity };
        }),
        updatedAt: new Date().toISOString()
      };
    }

    return {
      lines: [
        ...cart.lines,
        this.toCartLine(input, quantity)
      ],
      updatedAt: new Date().toISOString()
    };
  }

  static updateQuantity(cart: CartState, variantId: number, quantity: number): CartState {
    const normalizedQuantity = Math.max(0, Math.floor(quantity || 0));

    return {
      lines: cart.lines
        .map((line) => line.variantId === variantId ? { ...line, quantity: normalizedQuantity } : line)
        .filter((line) => line.quantity > 0),
      updatedAt: new Date().toISOString()
    };
  }

  static removeLine(cart: CartState, variantId: number): CartState {
    return {
      lines: cart.lines.filter((line) => line.variantId !== variantId),
      updatedAt: new Date().toISOString()
    };
  }

  static getItemCount(cart: CartState): number {
    return cart.lines.reduce((total, line) => total + line.quantity, 0);
  }

  static getSubtotal(cart: CartState): number {
    return cart.lines.reduce((total, line) => total + line.price * line.quantity, 0);
  }

  static toCheckoutInput(cart: CartState, discount?: string): ShoppegoCheckoutInput {
    return {
      lines: cart.lines.map((line) => ({
        variant_id: line.variantId,
        quantity: line.quantity
      })),
      ...(discount ? { discount } : {})
    };
  }

  private static toCartLine(input: AddToCartInput, quantity: number): CartLine {
    const image = input.variant.image || input.product.featured_image || input.product.images[0] || null;

    return {
      variantId: input.variant.id,
      productId: input.product.id,
      productSlug: input.product.slug,
      productName: input.product.name,
      variantTitle: input.variant.title,
      image,
      price: input.variant.price,
      compareAtPrice: input.variant.compare_at_price,
      quantity,
      options: Object.entries(input.variant.options).map(([name, value]) => ({ name, value }))
    };
  }
}
