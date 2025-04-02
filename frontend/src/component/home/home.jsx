import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle, DollarSign, ShoppingCart } from "lucide-react";
import Navbar from '../navbar/navbar';


export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-900">
                {/* Image Section with Fade-in Effect */}
                <section className="py-10">
                    <motion.img 
                        src={""} 
                        alt="HomeStock Overview" 
                        className="w-100 img-fluid" 
                        style={{ height: "auto", display: "block" }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    />
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center">Why Choose HomeStock?</h2>
                    <div className="grid md:grid-cols-3 gap-6 mt-10">
                        <FeatureCard icon={<ShoppingCart size={40} />} title="Grocery Management" description="Track your pantry, set reminders, and avoid food waste." />
                        <FeatureCard icon={<DollarSign size={40} />} title="Finance Tracking" description="Monitor bills, rent, and expenses with ease." />
                        <FeatureCard icon={<CheckCircle size={40} />} title="Stay Organized" description="Get smart notifications and insights to stay on top." />
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-6 bg-gray-200">
                    <p>&copy; 2025 HomeStock. All rights reserved.</p>
                    <p className="text-sm">Made with ❤️ by the HomeStock Team</p>
                </footer>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div 
            className="p-6 text-center bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <motion.div whileHover={{ scale: 1.1 }} className="mb-4">{icon}</motion.div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-600 mt-2">{description}</p>
        </motion.div>
    );
}
