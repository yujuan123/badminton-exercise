describe('Take out food', function () {
  it('buildCartItems', ()=> {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let allItems = loadAllItems();
    let cartItems = buildCartItems(inputs, allItems);
    let expectCartItems = [{
      item: {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00
      },
      count: 1
    },
      {
        item: {
          id: 'ITEM0013',
          name: '肉夹馍',
          price: 6.00
        },
        count: 2
      },
      {
        item: {
          id: 'ITEM0022',
          name: '凉皮',
          price: 8.00
        },
        count: 1
      }];
    expect(cartItems).toEqual(expectCartItems);
  });
  it('buildReceipt', ()=> {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let allItems = loadAllItems();
    let cartItems = buildCartItems(inputs, allItems);
    let promotions = loadPromotions();
    let receiptItems = buildReceiptItems(cartItems, promotions);
    let expectReceiptItems = [
      {
        cartItem: {
          item: {
            id: 'ITEM0001',
            name: '黄焖鸡',
            price: 18.00
          },
          count: 1
        },
        subtotal: 18,
        saved: 9
      },
      {
        cartItem: {
          item: {
            id: 'ITEM0013',
            name: '肉夹馍',
            price: 6.00
          },
          count: 2
        },
        subtotal: 12,
        saved: 0
      },
      {
        cartItem: {
          item: {
            id: 'ITEM0022',
            name: '凉皮',
            price: 8.00
          },
          count: 1
        },
        subtotal: 8,
        saved: 4
      }
    ];
    expect(receiptItems).toEqual(expectReceiptItems);
  });
  it('buildReceipt', ()=> {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let allItems = loadAllItems();
    let cartItems = buildCartItems(inputs, allItems);
    let promotions = loadPromotions();
    let receiptItems = buildReceiptItems(cartItems, promotions);
    let receipt = buildReceipt(receiptItems);
    let expectReceipt = {
      receiptItems: [
        {
          cartItem: {
            item: {
              id: 'ITEM0001',
              name: '黄焖鸡',
              price: 18.00
            },
            count: 1
          },
          subtotal: 18,
          saved: 9
        },
        {
          cartItem: {
            item: {
              id: 'ITEM0013',
              name: '肉夹馍',
              price: 6.00
            },
            count: 2
          },
          subtotal: 12,
          saved: 0
        },
        {
          cartItem: {
            item: {
              id: 'ITEM0022',
              name: '凉皮',
              price: 8.00
            },
            count: 1
          },
          subtotal: 8,
          saved: 4
        }
      ],
      total: 25,
      savedTotal: 13,
      promotionType: '指定菜品半价'
    };
    expect(receipt).toEqual(expectReceipt);
  });
  it('buildReceipt', ()=> {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let allItems = loadAllItems();
    let cartItems = buildCartItems(inputs, allItems);
    let promotions = loadPromotions();
    let receiptItems = buildReceiptItems(cartItems, promotions);
    let receipt = buildReceipt(receiptItems);
    let receiptText = buildReceiptText(receipt);
    expect(receiptText).toEqual(`============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`);
  });
  it('should generate best charge when best is 指定菜品半价', function () {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function () {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});
