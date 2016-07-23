'use strict'
function bestCharge(selectedItems) {
  const allItems = loadAllItems();
  const cartItems = buildCartItems(selectedItems, allItems);
  const promotions = loadPromotions();
  const receiptItems = buildReceiptItems(cartItems, promotions);
  const receipt = buildReceipt(receiptItems);
  const receiptText = buildReceiptText(receipt);
  return receiptText;
}

function toCartItems(selectedItems) {
  let items = selectedItems.map(selectedItem=>selectedItem.split('x'));
  return items
}
function buildCartItems(selectedItems, allItems) {
  const cartItems = [];
  const splitItems = toCartItems(selectedItems);
  for (let splitItem of splitItems) {
    let item = allItems.find(item=>item.id === splitItem[0].slice(0, -1));
    cartItems.push({item, count: parseInt(splitItem[1].slice(1, 2))});
  }
  return cartItems;
}
function findPromotions(id, promotions) {
  const promotion = promotions.find(promotion=> {
      if (promotion.items) {
        return promotion.items.some(b=>b === id)
      }
    }
  )
  return promotion ? promotion.type : 0;
}
function disCount(count, price, promotionType) {
  let subtotal = count * price;
  let saved = 0;
  if (promotionType === '指定菜品半价') {
    saved = count * price / 2;
  }
  return {saved, subtotal};
}
function buildReceiptItems(cartItems, promotions) {
  return cartItems.map(cartItem=> {
    const promotionType = findPromotions(cartItem.item.id, promotions);
    const {saved, subtotal}=disCount(cartItem.count, cartItem.item.price, promotionType);
    return {cartItem, subtotal, saved};
  })
}

function buildReceipt(receiptItems) {
  let total = 0;
  let savedTotal = 0;
  for (const receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    savedTotal += receiptItem.saved;
  }
  let thrift = 0;
  if (total >= 30) {
    thrift = 6;

  }
  if (savedTotal > thrift) {
    total -= savedTotal;
    return {receiptItems, total, savedTotal, promotionType: '指定菜品半价'};
  } else {
    savedTotal = thrift;
    total -= thrift;
  }
  return {receiptItems, total, savedTotal, promotionType: '满30减6元'};
}
function buildReceiptText(receipt) {
  let receiptText = receipt.receiptItems.map(receiptItem=> {
      const cartItem = receiptItem.cartItem;
      return `${cartItem.item.name} x ${cartItem.count} = ${receiptItem.subtotal}元`
    })
    .join('\n');
  let nameText = findDiscount(receipt.receiptItems);
  if (receipt.savedTotal > 6) {
    return `============= 订餐明细 =============
${receiptText}
-----------------------------------
使用优惠:
${receipt.promotionType}(${nameText})，省${receipt.savedTotal}元
-----------------------------------
总计：${receipt.total}元
===================================`
  }
  if (receipt.savedTotal === 6) {
    return `============= 订餐明细 =============
${receiptText}
-----------------------------------
使用优惠:
${receipt.promotionType}，省${receipt.savedTotal}元
-----------------------------------
总计：${receipt.total}元
===================================`
  }
  else {
    return `============= 订餐明细 =============
${receiptText}
-----------------------------------
总计：${receipt.total}元
===================================`
  }
}
function findDiscount(receiptItems) {
  return receiptItems.filter(receiptItem=>receiptItem.saved!=0)
    .map(receiptItem=>receiptItem.cartItem.item.name).join().replace(',','，');
}
