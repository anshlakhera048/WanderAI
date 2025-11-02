# Troubleshooting Guide

## Common Issues

### "Failed to generate trip" Error

If you're getting a "Failed to generate trip" error, here are the most common causes and solutions:

#### 1. Missing Environment Variables

**Problem:** The `.env` file is missing or incomplete.

**Solution:**
1. Create a `.env` file in the root directory if it doesn't exist
2. Add all required environment variables:

```env
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_oauth_client_id
VITE_GOOGLE_GENAI_API_KEY=your_google_generative_ai_api_key
```

#### 2. Missing Google Generative AI API Key

**Problem:** This is the most common issue! The `VITE_GOOGLE_GENAI_API_KEY` environment variable is required but was not documented in earlier versions of the README.

**Solution:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GOOGLE_GENAI_API_KEY`

#### 3. Dev Server Not Picking Up Environment Variables

**Problem:** After adding environment variables, the changes aren't reflected.

**Solution:**
1. Stop the dev server (Ctrl+C)
2. Restart the dev server with `npm run dev`

**Important:** Vite only loads environment variables when the dev server starts. You must restart the dev server after adding or changing environment variables.

#### 4. Incorrect API Key Format

**Problem:** The API key is not valid or properly formatted.

**Solution:**
- Ensure there are no extra spaces around the `=` sign
- Make sure the API key doesn't have quotes around it
- Verify the API key is active in your Google Cloud Console

### How to Get API Keys

#### Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Places API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key

#### Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Click "Create Credentials" → "OAuth client ID"
4. Select "Web application"
5. Add authorized JavaScript origins and redirect URIs
6. Copy the Client ID

#### Google Generative AI API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select your Google Cloud project (or create a new one)
4. Copy the API key

### Debugging Steps

1. **Check the browser console** for error messages
2. **Check the terminal** where the dev server is running for errors
3. **Verify .env file location** - it should be in the root directory (same level as `package.json`)
4. **Check environment variable names** - they must start with `VITE_` and match exactly
5. **Restart the dev server** after any environment variable changes

### Still Having Issues?

1. Make sure you've installed all dependencies: `npm install`
2. Try deleting `node_modules` and reinstalling: 
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Check if your API keys have proper quotas and billing enabled
4. Look at the Network tab in browser DevTools to see the actual API response

