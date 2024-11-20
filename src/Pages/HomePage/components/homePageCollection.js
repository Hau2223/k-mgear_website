import React from "react";
import { useNavigate } from "react-router-dom";
import product from "../../../utils/product.json";
import { Card } from "../../../utils/components/Card.js";

export function HomePageCollection({ type }) {
    const navigate = useNavigate();

    const handleCardClick = (itemId) => {
        navigate(`/product/${itemId}`);
    };

    const handleViewAllClick = () => {
        navigate(`/collections/${type}`);
    };

    const styles = {
        collection: {
            padding: "1%",
            marginBottom: "1%",
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
        },
        headerCollection: {
            padding: "0% 2%",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
        },
        headerTitle: {
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
        },
        brandsRow: {
            marginLeft: "auto",
        },
        brandLink: {
            textDecoration: "none",
            color: "white",
            fontSize: "20px",
            backgroundColor: "red",
            borderRadius: "5px",
            padding: "10px",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s",
        },
        brandLinkHover: {
            backgroundColor: "white",
            color: "red",
        },
        cardsRow: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "7px",
            padding: "10px",
            flex: 1,
            overflowY: "hidden",
        },
        card: {
            cursor: "pointer",
        },
    };

    return (
        <div style={styles.collection}>
            <div style={styles.headerCollection}>
                <h1 style={styles.headerTitle}>{type} HOT NHẤT</h1>
                <div style={styles.brandsRow}>
                    <button
                        onClick={handleViewAllClick}
                        style={styles.brandLink}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = styles.brandLinkHover.backgroundColor;
                            e.target.style.color = styles.brandLinkHover.color;
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = styles.brandLink.backgroundColor;
                            e.target.style.color = styles.brandLink.color;
                        }}
                    >
                        Xem tất cả
                    </button>
                </div>
            </div>
            <div style={styles.cardsRow}>
                {product
                    .filter((item) => item?.type === type)
                    .slice(0, 4)
                    .map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(item._id)}
                            style={styles.card}
                        >
                            <Card item={item} />
                        </div>
                    ))}
            </div>
        </div>
    );
}
