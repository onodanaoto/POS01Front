'use client';

import { useState } from 'react';

interface Product {
  prd_id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const [productCode, setProductCode] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 商品コードから商品情報を取得
  const handleProductSearch = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search?code=${productCode}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('商品がマスタ未登録です');
          setCurrentProduct(null);
          return;
        }
        throw new Error('商品の検索に失敗しました');
      }
      const product = await response.json();
      setCurrentProduct(product);
      setError(null);
    } catch (err) {
      console.error('Product search error:', err);
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setCurrentProduct(null);
    }
  };

  // カートに商品を追加
  const handleAddToCart = () => {
    if (!currentProduct) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.code === currentProduct.code);
      if (existingItem) {
        return prevCart.map(item =>
          item.code === currentProduct.code
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...currentProduct, quantity: 1 }];
    });

    // 入力欄とカレント商品をクリア
    setProductCode('');
    setCurrentProduct(null);
  };

  // 購入処理
  const handlePurchase = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emp_cd: '9999999999', // デフォルト値
          store_cd: '30',       // デフォルト値
          pos_no: '90',         // デフォルト値
          items: cart.map(item => ({
            prd_id: item.prd_id,
            prd_code: item.code,
            prd_name: item.name,
            prd_price: item.price,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('購入処理に失敗しました');
      }

      const result = await response.json();
      alert(`合計金額: ¥${result.total_amount.toLocaleString()}`);
      
      // カートをクリア
      setCart([]);
      setProductCode('');
      setCurrentProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左側: 商品入力エリア */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="商品コードを入力"
              className="flex-1 p-2 border rounded placeholder-black text-black"
            />
            <button
              onClick={handleProductSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transform transition-all active:bg-blue-700 active:scale-95"
            >
              商品コード読み込み
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {currentProduct && (
            <div className="mt-4 p-4 border rounded">
              <h3 className="font-bold">{currentProduct.name}</h3>
              <p>価格: {currentProduct.price}円</p>
              <div className="mt-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  個数
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={currentProduct.quantity}
                  onChange={(e) => setCurrentProduct({
                    ...currentProduct,
                    quantity: parseInt(e.target.value) || 0
                  })}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleAddToCart()}
                className="w-full px-4 py-2 bg-orange-500 text-black rounded hover:bg-orange-600 disabled:bg-gray-300 font-bold transform transition-all active:bg-orange-700 active:scale-95 mt-4"
              >
                カートに追加
              </button>
            </div>
          )}
        </div>

        {/* 右側: 購入リスト */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-4">購入リスト</h2>
          <div className="space-y-2 mb-4">
            {cart.map((item) => (
              <div key={item.code} className="flex justify-between items-center">
                <div>
                  <div>{item.name}</div>
                  <div className="text-sm text-gray-600">
                    x{item.quantity} ¥{item.price.toLocaleString()}
                  </div>
                </div>
                <div className="font-bold">
                  ¥{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold">合計</div>
              <div className="text-xl font-bold">
                ¥{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
              </div>
            </div>
            <button
              onClick={handlePurchase}
              disabled={cart.length === 0}
              className="w-full px-4 py-2 bg-orange-500 text-black rounded hover:bg-orange-600 disabled:bg-gray-300 font-bold transform transition-all active:bg-orange-700 active:scale-95"
            >
              購入
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
