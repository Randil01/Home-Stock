import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle, DollarSign, ShoppingCart, Home, PiggyBank, Calendar, Heart } from "lucide-react";
import Navbar from '../navbar/navbar';
import './home.css';

export default function Homepage() {
    return (
        <div className="homepage">
            <Navbar />
            
            {/* Hero Section with Curved Design */}
            <section className="hero-section">
                <div className="hero-bg">
                    <div className="wave">
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path d="M0,160L48,144C96,128,192,96,288,85.3C384,75,480,85,576,101.3C672,117,768,139,864,144C960,149,1056,139,1152,133.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>
                <div className="container">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="hero-title">
                            Smart Home Management
                            <span className="text-accent"> Made Simple</span>
                        </h1>
                        <p className="hero-subtitle">
                            Track groceries, manage assets, and handle finances all in one place. 
                            Make home management effortless and organized.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Our Features</h2>
                        <p className="section-subtitle">Discover all the ways HomeStock can help you manage your home</p>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4 mb-4">
                            <FeatureCard
                                icon={<ShoppingCart size={32} />}
                                title="Grocery Management"
                                description="Track your pantry items and never run out of essentials."
                                variant="green"
                            />
                        </div>
                        <div className="col-md-4 mb-4">
                            <FeatureCard
                                icon={<Home size={32} />}
                                title="Asset Tracking"
                                description="Keep track of your home assets and maintenance schedules."
                                variant="emerald"
                            />
                        </div>
                        <div className="col-md-4 mb-4">
                            <FeatureCard
                                icon={<DollarSign size={32} />}
                                title="Finance Tracking"
                                description="Monitor expenses and manage your household budget."
                                variant="green"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <FeatureCard
                                icon={<PiggyBank size={32} />}
                                title="Budget Planning"
                                description="Create and manage budgets for different categories."
                                variant="emerald"
                            />
                        </div>
                        <div className="col-md-4 mb-4">
                            <FeatureCard
                                icon={<Calendar size={32} />}
                                title="Smart Scheduling"
                                description="Never miss important dates with automated reminders."
                                variant="green"
                            />
                        </div>
                        <div className="col-md-4 mb-4">
                            <FeatureCard
                                icon={<CheckCircle size={32} />}
                                title="Stay Organized"
                                description="Get smart notifications and insights to stay on top."
                                variant="emerald"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <StatCard number="1000+" label="Happy Users" />
                        </div>
                        <div className="col-md-4 mb-4">
                            <StatCard number="50K+" label="Items Tracked" />
                        </div>
                        <div className="col-md-4 mb-4">
                            <StatCard number="95%" label="Time Saved" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer navbar-dark bg-dark">
                <div className="container">
                    <div className="text-center py-4">
                        <p className="mb-0 text-white">
                            © 2025 All Rights Reserved • Made with <Heart className="heart-icon" size={16} /> by HomeStock Team
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, variant }) {
    return (
        <motion.div
            className={`feature-card feature-card-${variant}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <div className="feature-icon">
                {icon}
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </motion.div>
    );
}

function StatCard({ number, label }) {
    return (
        <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="stat-number">{number}</div>
            <div className="stat-label">{label}</div>
        </motion.div>
    );
}