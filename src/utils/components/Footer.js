import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from "react-router-dom"; 

export function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-800 text-center mt-10">
            <div className="max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-around">
                    <InfoSection />
                    <CustomerServiceSection />
                    <SocialMediaSection />
                    <ContactSection />
                </div>
            </div>
            <FooterBottom />
        </footer>
    );
}

function InfoSection() {
    return (
        <div className="w-full sm:w-1/4 p-4">
            <h3 className="text-xl font-semibold mb-4">Thông tin</h3>
            <ul>
                <li><Link to="/about" className="text-gray-600 hover:text-red-500">Về chúng tôi</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-red-500">Liên hệ</Link></li>
                <li><Link to="/policy" className="text-gray-600 hover:text-red-500">Chính sách bảo mật</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-red-500">Điều khoản dịch vụ</Link></li>
            </ul>
        </div>
    );
}

function CustomerServiceSection() {
    return (
        <div className="w-full sm:w-1/4 p-4">
            <h3 className="text-xl font-semibold mb-4">Dịch vụ khách hàng</h3>
            <ul>
                <li><Link to="/support" className="text-gray-600 hover:text-red-500">Hỗ trợ khách hàng</Link></li>
                <li><Link to="/shipping" className="text-gray-600 hover:text-red-500">Giao hàng</Link></li>
                <li><Link to="/returns" className="text-gray-600 hover:text-red-500">Đổi trả hàng</Link></li>
                <li><Link to="/faq" className="text-gray-600 hover:text-red-500">Câu hỏi thường gặp</Link></li>
            </ul>
        </div>
    );
}

function SocialMediaSection() {
    return (
        <div className="w-full sm:w-1/4 p-4">
            <h3 className="text-xl font-semibold mb-4">Kết nối với chúng tôi</h3>
            <ul className="flex justify-around space-x-4">
                <li><a href="#" className="text-gray-600 hover:text-red-500"><FaFacebook /></a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-500"><FaInstagram /></a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-500"><FaTwitter /></a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-500"><FaLinkedin /></a></li>
            </ul>
        </div>
    );
}

function ContactSection() {
    return (
        <div className="w-full sm:w-1/4 p-4">
            <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
            <p className="text-gray-600">Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
            <p className="text-gray-600">Email: support@example.com</p>
            <p className="text-gray-600">Điện thoại: 1900.5301</p>
        </div>
    );
}

function FooterBottom() {
    return (
        <div className="bg-red-600 text-white py-4">
            <p>&copy; {new Date().getFullYear()} Công ty TNHH XYZ. Bảo lưu mọi quyền.</p>
        </div>
    );
}
