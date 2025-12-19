#!/usr/bin/env python3
"""
Script to download peptide vial images using Firecrawl API
Saves images to Downloads folder with naming: "Vici Peptides Site-[Peptide Name].jpg"
"""

import os
import requests
from pathlib import Path
import time
from urllib.parse import quote
import json

# Firecrawl API configuration
FIRECRAWL_API_KEY = "fc-31b6783e4e554b598ee79d017b0b0c0c"
FIRECRAWL_SEARCH_URL = "https://api.firecrawl.dev/v2/search"

# List of all peptides
PEPTIDES = [
    "5-amino-1mq",
    "ACETIC ACID",
    "AICAR",
    "AOD9604",
    "ARA 290",
    "Adipotide",
    "BPC-157",
    "BPC-157 + TB-500",
    "Bac Water",
    "CJC-1295 (without DAC) 5mg + IPA 5mg",
    "CJC-1295 with DAC",
    "CJC-1295 without DAC",
    "Cagrilintide",
    "Cagrilintide 5mg + Semaglutide",
    "Cerebrolysin",
    "DSIP",
    "Dermorphin",
    "Epitalon",
    "FOXO4",
    "GHK-Cu",
    "GHRP-2 Acetate",
    "GHRP-6 Acetate",
    "Glow",
    "Glutathione",
    "Gonadorelin",
    "Gonadorelin Acetate",
    "HCG",
    "HGH",
    "HMG",
    "Hexarelin Acetate",
    "IGF-1LR3",
    "Ipamorelin",
    "KPV",
    "Kisspeptin-10",
    "Klow",
    "L-carnitine",
    "LL37",
    "Lemon Bottle",
    "Lipo-c",
    "MGF",
    "MOTS-C",
    "Mazdutide",
    "Melanotan I",
    "Melanotan II",
    "Melatonin",
    "NAD+",
    "Oxytocin Acetate",
    "PEG-MGF",
    "PT-141",
    "Retatrutide",
    "SS-31",
    "Selank",
    "Semaglutide",
    "Semax",
    "Sermorelin",
    "Snap-8",
    "Survodutide",
    "TB-500 (Thymosin B4 Acetate)",
    "Tesamorelin",
    "Thymalin",
    "Thymosin Alpha-1",
    "Tirzepatide",
    "VIP"
]

def sanitize_filename(name):
    """Sanitize peptide name for filename"""
    # Replace problematic characters
    name = name.replace("/", "-")
    name = name.replace("+", "plus")
    name = name.replace("(", "")
    name = name.replace(")", "")
    name = name.replace(" ", "-")
    return name

def search_images(peptide_name, max_retries=3):
    """Search for images using Firecrawl API with retry logic"""
    for attempt in range(max_retries):
        try:
            # Build search query
            query = f"{peptide_name} peptide research vial product"
            
            headers = {
                "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "query": query,
                "limit": 5,
                "sources": [{"type": "images"}]
            }
            
            response = requests.post(
                FIRECRAWL_SEARCH_URL,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            # Handle rate limiting
            if response.status_code == 429:
                wait_time = (2 ** attempt) * 5  # Exponential backoff: 5s, 10s, 20s
                print(f"  Rate limited, waiting {wait_time}s before retry {attempt + 1}/{max_retries}...")
                time.sleep(wait_time)
                continue
            
            response.raise_for_status()
            data = response.json()
            
            if data.get("success") and "data" in data and "images" in data["data"]:
                images = data["data"]["images"]
                if images and len(images) > 0:
                    return images[0].get("imageUrl")  # Return first image URL
            
            return None
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429 and attempt < max_retries - 1:
                wait_time = (2 ** attempt) * 5
                print(f"  Rate limited, waiting {wait_time}s before retry {attempt + 1}/{max_retries}...")
                time.sleep(wait_time)
                continue
            print(f"  Error searching: {e}")
            return None
        except Exception as e:
            print(f"  Error searching: {e}")
            return None
    
    return None

def download_image(url, filepath, max_retries=2):
    """Download image from URL with retry logic"""
    for attempt in range(max_retries):
        try:
            # Try different user agents
            user_agents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]
            
            headers = {
                'User-Agent': user_agents[attempt % len(user_agents)],
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/'
            }
            
            response = requests.get(url, headers=headers, timeout=15, stream=True, allow_redirects=True)
            
            # Handle 403 errors by trying again with different headers
            if response.status_code == 403 and attempt < max_retries - 1:
                print(f"  403 Forbidden, retrying with different headers...")
                time.sleep(2)
                continue
            
            response.raise_for_status()
            
            # Check if it's actually an image
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                print(f"  Warning: URL doesn't appear to be an image (content-type: {content_type})")
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Verify file was created and has content
            if filepath.exists() and filepath.stat().st_size > 0:
                return True
            else:
                return False
                
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403 and attempt < max_retries - 1:
                print(f"  403 Forbidden, retrying...")
                time.sleep(2)
                continue
            print(f"  Error downloading: {e}")
            if filepath.exists():
                filepath.unlink()  # Remove partial file
            return False
        except Exception as e:
            print(f"  Error downloading: {e}")
            if filepath.exists():
                filepath.unlink()  # Remove partial file
            return False
    
    return False

def main():
    # Get Downloads folder path
    downloads_path = Path.home() / "Downloads"
    
    print(f"Downloading peptide images using Firecrawl API")
    print(f"Target folder: {downloads_path}")
    print(f"Total peptides: {len(PEPTIDES)}\n")
    print("="*60)
    
    successful = 0
    failed = 0
    skipped = 0
    
    for i, peptide in enumerate(PEPTIDES, 1):
        filename = f"Vici Peptides Site-{peptide}.jpg"
        filepath = downloads_path / filename
        
        print(f"\n[{i}/{len(PEPTIDES)}] {peptide}")
        print(f"  Target: {filename}")
        
        # Check if already exists
        if filepath.exists():
            print(f"  ✓ Already exists, skipping")
            skipped += 1
            continue
        
        # Search for image
        print(f"  Searching for image...")
        image_url = search_images(peptide)
        
        if not image_url:
            print(f"  ✗ No image found")
            failed += 1
            time.sleep(1)  # Rate limiting
            continue
        
        print(f"  Found image: {image_url[:80]}...")
        
        # Download image
        print(f"  Downloading...")
        if download_image(image_url, filepath):
            print(f"  ✓ Successfully downloaded")
            successful += 1
        else:
            print(f"  ✗ Download failed")
            failed += 1
        
        # Rate limiting - be respectful (longer delay to avoid 429 errors)
        time.sleep(3)
    
    # Summary
    print("\n" + "="*60)
    print("DOWNLOAD SUMMARY")
    print("="*60)
    print(f"Total peptides: {len(PEPTIDES)}")
    print(f"✓ Successful: {successful}")
    print(f"✗ Failed: {failed}")
    print(f"⊘ Skipped (already exists): {skipped}")
    print("="*60)

if __name__ == "__main__":
    main()

