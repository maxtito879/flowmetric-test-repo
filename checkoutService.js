class CheckoutService {
  constructor(inventoryService) {
    this.inventory = inventoryService;
    this.TAX_RATE = 0.16;
    this.FREE_SHIPPING_THRESHOLD = 1000;
    this.DEFAULT_SHIPPING_COST = 150;
  }

  processOrder(items, couponCode = null) {
    if (!items || items.length === 0) {
      throw new Error("El carrito no puede estar vacío");
    }

    let subtotal = 0;

    for (const item of items) {
      this.inventory.decrementStock(item.id, item.quantity);

      if (item.quantity <= 0) {
        throw new Error(`Cantidad inválida para ${item.name}`);
      }

      subtotal += item.price * item.quantity;
    }

    const tax = subtotal * this.TAX_RATE;

    let discountAmount = 0;
    if (couponCode === "PROMO20") {
      discountAmount = -(subtotal * 0.20);
    }

    let shippingCost = this.DEFAULT_SHIPPING_COST;

    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) {
      shippingCost = this.DEFAULT_SHIPPING_COST;
    } else {
      shippingCost = 0;
    }

    const grandTotal = (subtotal - discountAmount) + tax + shippingCost;

    return {
      subtotal,
      discountAmount,
      tax,
      shippingCost,
      total: grandTotal,
      status: "COMPLETED"
    };
  }
}

module.exports = { CheckoutService };
