// productUtils.js
export const addProduct = (product, setProductList, setOpenProductList) => {
    console.log('addProduct çağrıldı:', product);
    setOpenProductList(true);
    setProductList((prevList) => {
      const existingProduct = prevList.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevList.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevList, { ...product, quantity: 1 }];
    });
  };
  
  export const handleRemoveProduct = (id, setProductList) => {
    setProductList((prevList) => prevList.filter((product) => product.id !== id));
  };
  
  export const handleQuantityChange = (id, newQuantity, setProductList) => {
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  };
  
  export const handleActionChange = (id, value, setProductList) => {
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === id ? { ...product, action: value } : product
      )
    );
  };
  
  export const handleDateChange = (id, value, setProductList) => {
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === id ? { ...product, expiryDate: value } : product
      )
    );
  };

  
  
  