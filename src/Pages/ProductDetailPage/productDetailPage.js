import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import product from "../../utils/product.json";
import cart from "../../utils/cart.json";

export function ProductDetailPage() {
    return <ProductDetailPageBody />;
}

export function ProductDetailPageBody() {
    const { id } = useParams();
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const productDetails = product.find((item) => item._id === id);
        setProductData(productDetails);
    }, []);

    const handleBuyNow = (product) => {
        alert('Buying product: ' + product);
        console.log('Buying product:', product);
    };

    const handleAddToCart = (productID) => {
        const existingCarts = [];

        if (existingCarts.find((item) => item.productID === productID)) {
            return;
        }

        const now = new Date();
        const formattedDateTime = now.toLocaleString();

        const newCartItem = {
            _id: `cart_${existingCarts.length}`,
            productID: productID,
            quantity: 1,
            status: "waiting",
            date: formattedDateTime,
        };

        const updatedCarts = [...existingCarts, newCartItem];
        localStorage.setItem("carts", JSON.stringify(updatedCarts));

        alert('Item added to cart!');
    };

    const styles = {
        product: {
            display: 'flex',
            padding: '20px',
            maxWidth: '1200px',
            margin: '40px auto',
            border: '1px solid #eee',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            fontFamily: "'Arial', sans-serif",
        },
        productImage: {
            flex: 1,
            marginRight: '30px',
            borderRadius: '10px',
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: 'auto',
            transition: 'transform 0.3s',
        },
        imageHover: {
            transform: 'scale(1.05)',
        },
        productDetails: {
            flex: 2,
        },
        title: {
            fontSize: '28px',
            marginBottom: '15px',
            color: '#333',
        },
        flashSale: {
            backgroundColor: '#ff4500',
            color: '#fff',
            padding: '5px 15px',
            borderRadius: '5px',
            display: 'inline-block',
            marginBottom: '15px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        price: {
            fontSize: '24px',
            margin: '10px 0',
            display: 'flex',
            alignItems: 'center',
        },
        originalPrice: {
            textDecoration: 'line-through',
            color: '#999',
            fontSize: '20px',
        },
        discount: {
            color: '#ff4500',
            marginLeft: '10px',
            fontSize: '18px',
        },
        currentPrice: {
            color: '#ff4500',
            fontWeight: 'bold',
            fontSize: '24px',
            marginLeft: '15px',
        },
        productInfo: {
            margin: '15px 0',
            color: '#555',
        },
        infoText: {
            margin: '5px 0',
        },
        ctaButtons: {
            marginTop: '20px',
        },
        button: {
            padding: '12px 25px',
            fontSize: '16px',
            marginRight: '15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buyNow: {
            backgroundColor: '#28a745',
            color: 'white',
        },
        addToCart: {
            backgroundColor: '#007bff',
            color: 'white',
        },
        buttonHover: {
            opacity: 0.9,
        },
    };

    return (
        <div style={styles.product}>
            <div style={styles.productImage}>
                <img
                    src={productData?.imageUrl || '/path/to/fallback-image.jpg'}
                    alt={productData?.name}
                    style={styles.image}
                    onMouseOver={(e) => e.target.style.transform = styles.imageHover.transform}
                    onMouseOut={(e) => e.target.style.transform = ''}
                />
            </div>
            <div style={styles.productDetails}>
                <h1 style={styles.title}>{productData?.name}</h1>
                <div style={styles.flashSale}>FLASH SALE</div>
                <div style={styles.price}>
                    <span style={styles.originalPrice}>{productData?.price} VND</span>
                    <span style={styles.discount}>-{productData?.discount}%</span>
                    <span style={styles.currentPrice}>
                        {(
                            productData?.price - (productData?.discount / 100) * productData?.price
                        ).toFixed(2)} VND
                    </span>
                </div>
                <div style={styles.productInfo}>
                    <p style={styles.infoText}>Còn lại: <strong>{productData?.quantity}</strong></p>
                    <p style={styles.infoText}>Hãng: <strong>{productData?.brand}</strong></p>
                    <p style={styles.infoText}>Đánh giá: <strong>{productData?.rating}</strong> ({productData?.totalReviews} đánh giá)</p>
                    <p style={styles.infoText}>Đã bán: <strong>{productData?.sold}</strong></p>
                </div>
                <div style={styles.ctaButtons}>
                    <button
                        style={{ ...styles.button, ...styles.buyNow }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                        onMouseOut={(e) => e.target.style.backgroundColor = styles.buyNow.backgroundColor}
                        onClick={() => handleBuyNow(productData?._id)}
                    >
                        MUA NGAY
                    </button>
                    <button
                        style={{ ...styles.button, ...styles.addToCart }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = styles.addToCart.backgroundColor}
                        onClick={() => handleAddToCart(productData?._id)}
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
