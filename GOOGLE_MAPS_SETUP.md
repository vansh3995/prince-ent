# Google Maps API Setup Guide

## Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable billing (required for Maps API)

## Step 2: Enable APIs
1. Go to "APIs & Services" > "Library"
2. Enable these APIs:
   - Maps JavaScript API
   - Places API (if using places)
   - Geocoding API (if converting addresses)

## Step 3: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 4: Secure Your API Key (Important!)
1. Click on your API key to edit it
2. Under "API restrictions", select "Restrict key"
3. Choose the APIs you enabled above
4. Under "Application restrictions":
   - For development: Choose "HTTP referrers"
   - Add: http://localhost:3000/*, http://localhost:3001/*
   - For production: Add your domain

## Step 5: Update Environment File
Replace 'your-google-maps-api-key' in .env.local with your actual API key

## Pricing Info:
- Google provides $200 free credit monthly
- Maps JavaScript API: $7 per 1000 loads
- Most small apps stay within free tier
