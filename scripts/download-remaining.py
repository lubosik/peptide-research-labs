#!/usr/bin/env python3
"""Try alternative search terms for remaining peptides"""

import requests
from pathlib import Path
import time

FIRECRAWL_API_KEY = "fc-31b6783e4e554b598ee79d017b0b0c0c"
FIRECRAWL_SEARCH_URL = "https://api.firecrawl.dev/v2/search"

# Remaining peptides with alternative search terms
REMAINING = [
    ("BPC-157", ["BPC-157 peptide vial", "BPC157 research peptide", "BPC 157 product"]),
    ("CJC-1295 (without DAC) 5mg + IPA 5mg", ["CJC-1295 ipamorelin blend", "CJC-1295 IPA combo peptide"]),
    ("GHRP-2 Acetate", ["GHRP-2 peptide", "GHRP2 acetate vial"]),
    ("Mazdutide", ["Mazdutide peptide", "Mazdutide GLP-1"]),
    ("Survodutide", ["Survodutide peptide", "Survodutide GLP-1"])
]

def search_images(query, max_retries=2):
    for attempt in range(max_retries):
        try:
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
                wait_time = 10
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
                time.sleep(5)
            else:
                return None
    return None

def download_image(url, filepath):
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
        if filepath.exists():
            filepath.unlink()
        return False

def main():
    downloads_path = Path.home() / "Downloads"
    
    for peptide, search_terms in REMAINING:
        filename = f"Vici Peptides Site-{peptide}.jpg"
        filepath = downloads_path / filename
        
        if filepath.exists():
            print(f"✓ {peptide} - Already exists")
            continue
        
        print(f"\n[{peptide}]")
        print(f"  Target: {filename}")
        
        image_url = None
        for search_term in search_terms:
            print(f"  Trying: '{search_term}'...")
            image_url = search_images(search_term)
            if image_url:
                print(f"  Found: {image_url[:60]}...")
                break
            time.sleep(3)
        
        if not image_url:
            print(f"  ✗ No image found with any search term")
            continue
        
        print(f"  Downloading...")
        if download_image(image_url, filepath):
            print(f"  ✓ Success!")
        else:
            print(f"  ✗ Download failed")
        
        time.sleep(5)

if __name__ == "__main__":
    main()

