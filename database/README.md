# Voting Application Database

This directory contains database migration scripts and configuration.

## Setup

1. Install PostgreSQL (if not already installed)
2. Create a database:
   ```
   createdb voting_app
   ```

3. Run migrations:
   ```
   npm run migrate
   ```

## Database Schema

- **users**: Stores user information (email, password)
- **votes**: Stores vote information (title, organizer, settings)
- **vote_options**: Stores options for each vote
- **votes_submitted**: Stores submitted votes with voter reference
