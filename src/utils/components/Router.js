import React from 'react'
import { Footer } from './Footer.js'
import { Header } from './Header.js'
import { Routes, Route } from 'react-router-dom'
import { BANNERS } from "../constants.js";
import { HomePageBody } from '../../Pages/HomePage/homePage.js'
import { ProductDetailPage } from '../../Pages/ProductDetailPage/productDetailPage.js'
import { ProductPage } from '../../Pages/ProductPage/productPage.js'
import { CartPage } from '../../Pages/CartPage/cartPage.js'
import { SearchPage } from '../../Pages/SearchPage/searchPage.js'


export function NavigationHandler() {
    return (
        <>
            <Header />
            <Body />
            <Footer />
        </>

    )
}
function Body() {
    return (
        <div className="relative">
           <main className="flex justify-center px-5 m-auto">
                {/* Left Banner */}
                <div className="fixed py-5 left-5 w-1/12 flex-shrink-0">
                    <img src={BANNERS.FIRST} alt="Left Banner" className="w-full h-auto" />
                </div>

                {/* Content Area */}
                <div className="flex-auto max-w-full">
                    <Routes>
                        <Route path="/" element={<HomePageBody />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/collections/:type" element={<ProductPage />} />
                        <Route path="/search/:searchTerm" element={<SearchPage />} />
                    </Routes>
                </div>

                {/* Right Banner */}
                <div className="fixed py-5  right-5 w-1/12 flex-shrink-0">
                    <img src={BANNERS.SECOND} alt="Right Banner" className="w-full h-auto" />
                </div>
            </main>
        </div>
    );
}


