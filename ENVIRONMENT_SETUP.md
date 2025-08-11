# Environment Setup Guide

This document explains how to set up the environment variables and external services for the İyiki Sen Sevgilim project.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### Supabase Configuration
```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Cloudinary Configuration
```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## External Services Setup

### 1. Supabase
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Get your project URL and anon key from the API settings
4. Update the environment variables with your values

### 2. Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. Get your cloud name from the dashboard
3. Create an upload preset in the upload settings
4. Update the environment variables with your values

## Current Configuration

**Note**: The current project uses hardcoded values for demonstration purposes. In production, you should:

1. Move all hardcoded values to environment variables
2. Never commit API keys to version control
3. Use different keys for development and production

### Files to Update
- `src/utils/supabaseClient.js` - Replace hardcoded Supabase credentials
- `src/utils/uploadToCloudinary.js` - Replace hardcoded Cloudinary settings

## Security Notes

- Keep your `.env` file private and never commit it to version control
- Use different API keys for development and production environments
- Regularly rotate your API keys
- Monitor your API usage to prevent abuse
