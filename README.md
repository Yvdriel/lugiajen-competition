# Karate Tournament Sign-up Application

A full-stack web application for managing karate tournament registrations using Next.js, Prisma, Clerk, and Stripe.

## Features

### User Features

- **Registration Form**: Complete sign-up form with personal details, karate school, belt color, age, email, and competition type (Kata/Kumite)
- **Payment Integration**: Secure payment processing via Stripe
- **Payment Confirmation**: Automatic payment status updates upon successful payment

### Admin Features

- **Authentication**: Secure admin login via Clerk
- **Competition Management**: Create and manage multiple competitions
- **Contestant Overview**: View all registered contestants with payment status
- **Competition Control**: Toggle competitions as active/inactive and open/closed for registration
- **Single Active Competition**: Only one competition can be active at a time

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: ShadCN/UI
- **Database**: Prisma with PostgreSQL
- **Authentication**: Clerk
- **Payments**: Stripe
- **Deployment**: Ready for Vercel/Netlify

## Setup Instructions

### 1. Environment Variables

Update the `.env` file with your actual API keys:

```env
# Database
DATABASE_URL="your_database_url"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Payment
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### 3. Stripe Webhook Setup

1. In your Stripe dashboard, create a webhook endpoint
2. Set the URL to: `https://yourdomain.com/api/webhooks/stripe`
3. Select the event: `checkout.session.completed`
4. Copy the webhook secret to your `.env` file

### 4. Clerk Setup

1. Create a Clerk application
2. Copy the publishable key and secret key to your `.env` file
3. Configure the sign-in and sign-up URLs in Clerk dashboard

### 5. Run the Application

```bash
npm install
npm run dev
```

## API Routes

### Public Routes

- `GET /` - Registration form
- `POST /api/contestants` - Create new contestant
- `GET /api/contestants` - Get all contestants (admin only)

### Admin Routes (Protected)

- `GET /admin` - Admin dashboard
- `POST /api/competitions` - Create new competition
- `GET /api/competitions` - Get all competitions
- `PATCH /api/competitions/[id]` - Update competition status

### Webhooks

- `POST /api/webhooks/stripe` - Stripe payment webhook

## Database Schema

### Competition

- `id`: Unique identifier
- `name`: Competition name
- `description`: Optional description
- `isActive`: Only one competition can be active
- `isOpen`: Whether registration is open
- `createdAt`: Creation timestamp

### Contestant

- `id`: Unique identifier
- `firstName`: First name
- `lastName`: Last name
- `karateSchool`: Karate school name
- `beltColor`: Current belt color
- `age`: Contestant age
- `email`: Email address
- `kata`: Boolean for Kata participation
- `kumite`: Boolean for Kumite participation
- `paid`: Payment status
- `competitionId`: Foreign key to Competition
- `createdAt`: Creation timestamp

## Usage

### For Contestants

1. Visit the homepage
2. Fill out the registration form
3. Complete payment via Stripe
4. Receive confirmation

### For Admins

1. Sign in at `/admin`
2. Create new competitions
3. Manage competition status
4. View all contestants and payment status

## Deployment

The application is ready for deployment on Vercel or Netlify. Make sure to:

1. Set all environment variables in your deployment platform
2. Update the `NEXT_PUBLIC_BASE_URL` for production
3. Configure Stripe webhooks with the production URL
4. Set up Clerk application for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
