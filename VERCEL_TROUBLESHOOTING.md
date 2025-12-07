# Vercel Deployment Troubleshooting Guide

## Current Configuration

Your project is set up with:
- **Entry Point**: `api/index.py`
- **Handler**: `handler = Mangum(app)`
- **Configuration**: `vercel.json` with builds and routes

## Steps to Debug 404 Error

### 1. Check Vercel Deployment Logs

1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Check both:
   - **Build Logs** - Look for Python import errors
   - **Function Logs** - Look for runtime errors

### 2. Verify Environment Variables

Make sure `DB_URL` is set in Vercel:
- Go to Project Settings → Environment Variables
- Ensure `DB_URL` is set for Production, Preview, and Development

### 3. Test the Handler Locally

Test if the handler works locally:
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Test locally
vercel dev
```

### 4. Check the Function URL

After deployment, try accessing:
- `https://your-project.vercel.app/` - Should return the root route
- `https://your-project.vercel.app/api` - Should also work
- `https://your-project.vercel.app/get_all_items` - Should return items or error

### 5. Alternative: Try Zero-Config Approach

If the current setup doesn't work, try removing `vercel.json` and let Vercel auto-detect:

1. Delete or rename `vercel.json`
2. Ensure `api/index.py` exists with the handler
3. Redeploy

### 6. Check Python Version

Vercel uses Python 3.9 by default. If you need a different version, add to `vercel.json`:
```json
{
  "functions": {
    "api/index.py": {
      "runtime": "python3.9"
    }
  }
}
```

## Common Issues and Solutions

### Issue: "ModuleNotFoundError"
**Solution**: All imports must be relative to the `api/` directory or use absolute imports with proper path setup.

### Issue: "Handler not found"
**Solution**: Ensure `handler = Mangum(app)` is at the module level in `api/index.py`.

### Issue: "Database connection failed"
**Solution**: 
- Check `DB_URL` environment variable is set
- Verify MongoDB Atlas network access allows `0.0.0.0/0`
- Check connection string format

### Issue: Routes return 404
**Solution**: 
- Verify `vercel.json` routes are correct
- Check that routes don't have trailing slash issues
- Ensure FastAPI app has `redirect_slashes=False`

## Next Steps

1. Check the deployment logs in Vercel dashboard
2. Share the specific error message you see
3. Try accessing the root route: `https://your-project.vercel.app/`
4. Check if the function appears in Vercel's Functions tab

