#!/usr/bin/env python3
"""
Batch download script - processes 6 peptides at a time
"""

import os
import requests
from pathlib import Path
import time
import sys

# Firecrawl API configuration
FIRECRAWL_API_KEY = "fc-31b6783e4e554b598ee79d017b0b0c0c"
FIRECRAWL_SEARCH_URL = "https://api.firecrawl.dev/v2/search"

# List of all peptides
PEPTIDES = [
    "5-amino-1mq", "ACETIC ACID", "AICAR", "AOD9604", "ARA 290", "Adipotide",
    "BPC-157", "BPC-157 + TB-500", "Bac Water", "CJC-1295 (without DAC) 5mg + IPA 5mg",
    "CJC-1295 with DAC", "CJC-1295 without DAC", "Cagrilintide", "Cagrilintide 5mg + Semaglutide",
    "Cerebrolysin", "DSIP", "Dermorphin", "Epitalon", "FOXO4", "GHK-Cu",
    "GHRP-2 Acetate", "GHRP-6 Acetate", "Glow", "Glutathione", "Gonadorelin",
    "Gonadorelin Acetate", "HCG", "HGH", "HMG", "Hexarelin Acetate", "IGF-1LR3",
    "Ipamorelin", "KPV", "Kisspeptin-10", "Klow", "L-carnitine", "LL37",
    "Lemon Bottle", "Lipo-c", "MGF", "MOTS-C", "Mazdutide", "Melanotan I",
    "Melanotan II", "Melatonin", "NAD+", "Oxytocin Acetate", "PEG-MGF", "PT-141",
    "Retatrutide", "SS-31", "Selank", "Semaglutide", "Semax", "Sermorelin",
    "Snap-8", "Survodutide", "TB-500 (Thymosin B4 Acetate)", "Tesamorelin",
    "Thymalin", "Thymosin Alpha-1", "Tirzepatide", "VIP"
]

def search_images(peptide_name, max_retries=3):
    """Search for images using Firecrawl API with retry logic"""
    for attempt in range(max_retries):
        try:
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
            response = requests.post(FIRECRAWL_SEARCH_URL, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 429:
                wait_time = (2 ** attempt) * 5
                print(f"  Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            
            response.raise_for_status()
            data = response.json()
            
            if data.get("success") and "data" in data and "images" in data["data"]:
                images = data["data"]["images"]
                if images and len(images) > 0:
                    return images[0].get("imageUrl")
            return None
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) * 5
                print(f"  Error, retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  Error: {e}")
                return None
    return None

def download_image(url, filepath):
    """Download image from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://www.google.com/'
        }
        response = requests.get(url, headers=headers, timeout=15, stream=True, allow_redirects=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return filepath.exists() and filepath.stat().st_size > 0
    except Exception as e:
        print(f"  Download error: {e}")
        if filepath.exists():
            filepath.unlink()
        return False

def main():
    downloads_path = Path.home() / "Downloads"
    batch_size = 6
    
    # Find peptides that need downloading
    missing = []
    for peptide in PEPTIDES:
        filename = f"Vici Peptides Site-{peptide}.jpg"
        filepath = downloads_path / filename
        if not filepath.exists():
            missing.append(peptide)
    
    if not missing:
        print("All images already downloaded!")
        return
    
    # Process batch
    batch = missing[:batch_size]
    print(f"Processing batch of {len(batch)} peptides ({len(missing)} remaining total)\n")
    
    for i, peptide in enumerate(batch, 1):
        filename = f"Vici Peptides Site-{peptide}.jpg"
        filepath = downloads_path / filename
        
        print(f"[{i}/{len(batch)}] {peptide}")
        print(f"  Target: {filename}")
        
        print(f"  Searching...")
        image_url = search_images(peptide)
        
        if not image_url:
            print(f"  ✗ No image found")
            time.sleep(3)
            continue
        
        print(f"  Found: {image_url[:60]}...")
        print(f"  Downloading...")
        
        if download_image(image_url, filepath):
            print(f"  ✓ Success!")
        else:
            print(f"  ✗ Download failed")
        
        time.sleep(3)  # Rate limiting
    
    remaining = len(missing) - len(batch)
    print(f"\n✓ Batch complete! {remaining} peptides remaining.")

if __name__ == "__main__":
    main()

