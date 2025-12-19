# Strapi CMS Setup Guide

## ✅ What's Been Done

1. **Strapi Backend Created**: Strapi v5.33.0 has been added to your repository in the `/strapi` subdirectory
2. **Dependencies Configured**: `package.json` includes all required Strapi dependencies that Strapi Cloud will detect
3. **PostgreSQL Support**: Database configuration supports PostgreSQL (required by Strapi Cloud)
4. **Git Integration**: All Strapi files have been committed and pushed to GitHub

## 🚀 Connecting to Strapi Cloud

### Step 1: Log in to Strapi Cloud
1. Navigate to [https://cloud.strapi.io](https://cloud.strapi.io)
2. Log in with GitHub (use the same account that owns your repository)

### Step 2: Create New Project
1. Click **Create project**
2. Choose your plan (Free, Essential, Pro, or Scale)
3. Select **"Own existing repo & Strapi project"** tab
4. Connect your GitHub account if not already connected
5. Select your repository: `lubosik/peptide-research-labs`

### Step 3: Configure Project Settings

**Important Settings:**
- **Display name**: `peptide-research-labs-cms` (or your preferred name)
- **Git branch**: `feature/contact-blog-integration` (or `main` if you merge first)
- **Deploy on push**: ✅ Enable (auto-deploy on commits)
- **Region**: Choose closest to your users (US East, Europe West, or Asia Southeast)

**Advanced Settings:**
- **Base directory**: `strapi` ⚠️ **CRITICAL** - This tells Strapi Cloud where your Strapi app is located
- **Environment variables**: Add any custom variables if needed
- **Node version**: Auto-detected (should be 20.x or 24.x)

### Step 4: Complete Deployment
1. Review your project settings
2. Complete billing (if on paid plan)
3. Click **Create project**
4. Wait for deployment to complete (usually 2-5 minutes)

## 📋 Next Steps After Deployment

### 1. Create Admin User
Once deployed, you'll be prompted to create your first admin user:
- Email: Your email
- Password: Create a strong password
- First name & Last name: Your name

### 2. Configure Content Types
You'll need to create content types to replace Airtable:

**Product Content Type:**
- Name (Text)
- Slug (UID, based on Name)
- Description (Rich Text)
- Short Description (Text)
- Image (Media)
- Category (Relation or Enum)
- Variants (Component or JSON)
- Price (Number)
- In Stock (Boolean)
- SKU (Text)
- And other product fields...

**Article/Blog Content Type:**
- Title (Text)
- Slug (UID)
- Content (Rich Text)
- Cover Image (Media)
- Published Date (Date)
- Author (Text)
- And other article fields...

### 3. Migrate Data from Airtable
You can either:
- Manually enter products in Strapi admin panel
- Use Strapi's import/export features
- Create a migration script to transfer data from Airtable to Strapi

### 4. Update Next.js to Use Strapi
Replace Airtable API calls with Strapi API calls:

```typescript
// Example: lib/strapiClient.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getProducts() {
  const res = await fetch(`${STRAPI_URL}/api/products?populate=*`);
  const data = await res.json();
  return data.data;
}
```

## 🔧 Environment Variables

Add these to your Strapi Cloud project settings:

```env
# Strapi will auto-configure these, but you can customize:
DATABASE_CLIENT=postgres
DATABASE_URL=<auto-provided-by-strapi-cloud>

# For Next.js integration:
NEXT_PUBLIC_STRAPI_URL=https://your-project.strapi.app
STRAPI_API_TOKEN=<generate-in-strapi-admin>
```

## 📝 Important Notes

1. **Base Directory**: Always set to `strapi` when deploying - this is critical!
2. **Database**: Strapi Cloud automatically provides PostgreSQL - no setup needed
3. **API Access**: Enable API access in Strapi admin panel for your Next.js app
4. **CORS**: Configure CORS in Strapi to allow requests from your Next.js domain
5. **Media Library**: Images uploaded to Strapi will be hosted on Strapi Cloud

## 🐛 Troubleshooting

**"Strapi isn't found in the projects dependencies"**
- ✅ This should now be resolved - `strapi/package.json` contains Strapi dependencies
- Make sure you set **Base directory** to `strapi` in Strapi Cloud settings

**Deployment fails**
- Check build logs in Strapi Cloud dashboard
- Ensure Node version matches (20.x or 24.x)
- Verify all required files are in the `strapi/` directory

**Can't connect from Next.js**
- Check CORS settings in Strapi admin panel
- Verify `NEXT_PUBLIC_STRAPI_URL` environment variable
- Ensure API token is correctly configured

## 📚 Resources

- [Strapi Cloud Documentation](https://docs.strapi.io/cloud)
- [Strapi Content API](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Content-Type Builder](https://docs.strapi.io/dev-docs/backend-customization/models)

---

**Status**: ✅ Ready for Strapi Cloud deployment
**Last Updated**: 2024-12-19

