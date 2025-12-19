#!/usr/bin/env python3
"""
Script to download peptide vial images from the web
Saves images to Downloads folder with naming: "Vici Peptides Site-[Peptide Name].jpg"
"""

import os
import requests
from pathlib import Path
import time
from urllib.parse import quote

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

def download_image(url, filepath):
    """Download image from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"  Error downloading: {e}")
        return False

def main():
    # Get Downloads folder path
    downloads_path = Path.home() / "Downloads"
    
    print(f"Downloading peptide images to: {downloads_path}")
    print(f"Total peptides: {len(PEPTIDES)}\n")
    
    # Note: This script provides a framework
    # Actual image URLs need to be found manually or through image search APIs
    # For now, we'll create placeholder files with instructions
    
    for i, peptide in enumerate(PEPTIDES, 1):
        sanitized = sanitize_filename(peptide)
        filename = f"Vici Peptides Site-{peptide}.jpg"
        filepath = downloads_path / filename
        
        print(f"{i}/{len(PEPTIDES)}: {peptide}")
        print(f"  Target: {filename}")
        
        if filepath.exists():
            print(f"  ✓ Already exists, skipping")
        else:
            print(f"  ⚠ Image not found - needs manual download")
            print(f"  Search for: '{peptide} peptide research vial product image'")
        
        print()
        time.sleep(0.5)  # Be respectful with requests
    
    print("\n" + "="*60)
    print("NOTE: This script provides the framework.")
    print("To actually download images, you need to:")
    print("1. Use Google Images or similar to find vial images")
    print("2. Download each image manually")
    print("3. Save with the naming format: 'Vici Peptides Site-[Peptide Name].jpg'")
    print("="*60)

if __name__ == "__main__":
    main()

