# Get-Me-A-Coke: Creator Crowdfunding Platform

A full-stack web application that enables content creators to receive monetary support from fans through a streamlined donation platform.

## Project Overview

Get-Me-A-Coke is a creator monetization platform built with modern web technologies, featuring secure payment processing, user authentication, and comprehensive analytics dashboards for creators to track supporter engagement and donation metrics.

## Architecture

The application follows a client-server architecture with clear separation of concerns:

- Frontend: Next.js 15 with React Server Components and dynamic routing
- Backend: Next.js API Routes (serverless functions)
- Database: MongoDB with aggregation pipelines for complex queries
- Payment Processing: Stripe for secure transaction handling
- Image Management: Cloudinary for dynamic asset storage and CDN delivery
- Deployment: Vercel serverless platform

## Technology Stack

### Frontend
- Next.js 15 (App Router with dynamic [username] routes)
- React 18 with Hooks (useCallback, useEffect, useParams, useContext)
- TailwindCSS for responsive UI design
- Redux Toolkit for global state management
- NextAuth.js for authentication flows

### Backend
- Next.js API Routes for RESTful endpoints
- MongoDB with transaction support for ACID compliance
- Mongoose for schema validation and data modeling
- Stripe API for payment processing and webhook handling
- Nodemailer for OTP email delivery

### Authentication & Security
- JWT (JSON Web Tokens) for session management
- Google OAuth 2.0 social login integration
- Email-based OTP (One-Time Password) verification
- RBAC (Role-Based Access Control) for user permissions
- Secure webhook handlers with idempotent design to prevent duplicate transactions

### Analytics & Reporting
- MongoDB aggregation pipelines ($match, $group, $project stages) for payment analytics
- Real-time dashboard metrics: total donations, average amounts, unique supporter counts, top supporters ranking
- localStorage persistence for offline profile data caching

### DevOps & Performance
- Vercel deployment with serverless infrastructure
- Next.js Image optimization for Core Web Vitals
- Static asset caching and CDN acceleration
- Automated webhook processing for Stripe payment confirmations

## Performance Metrics

- Lighthouse Performance: 99
- Accessibility Score: 96
- SEO Score: 92
- First Contentful Paint (FCP): 0.6s
- Largest Contentful Paint (LCP): 0.7s
- Cumulative Layout Shift (CLS): 0

## Key Features

- Dynamic creator profiles with customizable branding
- One-click Stripe checkout for frictionless donations
- Real-time payment confirmation and transaction receipts
- Comprehensive analytics dashboard for donation metrics
- Multi-factor authentication with OTP verification
- Responsive design optimized for mobile and desktop
- Cloud-based image management with Cloudinary integration
- Admin capabilities for user and payment management



![alt text](<Screenshot 2025-12-05 010652.png>)