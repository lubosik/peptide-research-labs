#!/usr/bin/env python3
"""
Vici Peptides Image Generation System
Uses Google Gemini 3 Pro Image Preview to generate standardized peptide vial images
Processes in batches of 6 peptides
"""

import os
import sys
import json
import base64
import requests
import time
from pathlib import Path
from datetime import datetime
from typing import List, Tuple, Optional
import logging

# Configuration
GEMINI_API_KEY = "AIzaSyCYLFiW25zruuPedV___o16_51vlVh5SBM"
# Try both model names - user mentioned "nano banana pro 3"
GEMINI_MODEL = "gemini-3-pro-image-preview"  # Default, will try alternatives if this fails
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
BATCH_SIZE = 1  # Process one at a time

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
DOWNLOADS_PATH = Path.home() / "Downloads"
TEMPLATE_IMAGE = DOWNLOADS_PATH / "Vici Peptides Site-USE-TEMPLATE+.jpg"
LOGO_IMAGE = DOWNLOADS_PATH / "Vici Peptides Logo NEW.png"
OUTPUT_DIR = PROJECT_ROOT / "public" / "images" / "products"
LOG_FILE = PROJECT_ROOT / "logs" / "image-generation.log"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# List of all unique peptides (from previous analysis)
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

def load_image_as_base64(image_path: Path) -> Optional[str]:
    """Load an image file and convert to base64"""
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
            # Determine MIME type
            if image_path.suffix.lower() == '.jpg' or image_path.suffix.lower() == '.jpeg':
                mime_type = 'image/jpeg'
            elif image_path.suffix.lower() == '.png':
                mime_type = 'image/png'
            else:
                mime_type = 'image/jpeg'
            
            base64_data = base64.b64encode(image_data).decode('utf-8')
            return f"data:{mime_type};base64,{base64_data}"
    except Exception as e:
        logger.error(f"Error loading image {image_path}: {e}")
        return None

def get_strength_range(peptide_name: str) -> str:
    """Extract or determine strength range for peptide"""
    # This is a simplified version - in production, you'd query Airtable for actual variants
    # For now, return a default range
    if "5mg" in peptide_name or "10mg" in peptide_name:
        return "5 – 15 mg"
    elif "10mg" in peptide_name or "20mg" in peptide_name:
        return "10 – 20 mg"
    else:
        return "10 mg"

def generate_image_filename(peptide_name: str) -> str:
    """Generate filename: vici-[peptide-name].png"""
    # Convert to lowercase, replace spaces and special chars with hyphens
    filename = peptide_name.lower()
    filename = filename.replace(" ", "-")
    filename = filename.replace("+", "plus")
    filename = filename.replace("(", "")
    filename = filename.replace(")", "")
    filename = filename.replace("/", "-")
    filename = filename.replace("–", "-")
    # Remove multiple consecutive hyphens
    while "--" in filename:
        filename = filename.replace("--", "-")
    # Remove leading/trailing hyphens
    filename = filename.strip("-")
    return f"vici-{filename}.png"

def create_gemini_prompt(peptide_name: str, strength: str) -> str:
    """Create the prompt for Gemini API"""
    return f"""Generate a photorealistic 3-D render of a clear glass peptide vial standing upright on an ivory background (#F6F1EB) with soft diffused studio lighting from the upper left. The vial has a metallic silver matte cap and a curved transparent body showing a faint colorless liquid. Apply a centered ivory label displaying the Vici Peptides logo in charcoal serif text, followed by the peptide name {peptide_name} and dosage {strength}, and beneath that the lines '99 % Purity' and 'For Research Purposes Only'. The label must appear professionally printed with clean alignment and correct curvature around the bottle. No reflections, no clutter, no colored backgrounds. Photorealistic product photography style, 1 : 1 framing, pure ivory background."""

def generate_image_with_gemini(peptide_name: str, strength: str, max_retries: int = 3) -> Optional[bytes]:
    """Generate image using Gemini 3 Pro Image Preview API"""
    
    # Load reference images
    template_base64 = load_image_as_base64(TEMPLATE_IMAGE)
    logo_base64 = load_image_as_base64(LOGO_IMAGE)
    
    if not template_base64 or not logo_base64:
        logger.error(f"Failed to load reference images for {peptide_name}")
        return None
    
    prompt = create_gemini_prompt(peptide_name, strength)
    
    # Prepare the request payload
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    },
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": template_base64.split(",")[1]  # Remove data:image/jpeg;base64, prefix
                        }
                    },
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": logo_base64.split(",")[1]  # Remove data:image/png;base64, prefix
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {
                "aspectRatio": "1:1",
                "imageSize": "2K"
            }
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    # Try different model names if needed
    model_names = [
        "gemini-3-pro-image-preview",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "imagen-3.0-generate-001"  # Alternative image generation model
    ]
    
    for model_name in model_names:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={GEMINI_API_KEY}"
        
        for attempt in range(max_retries):
            try:
                start_time = time.time()
                logger.info(f"Generating image for {peptide_name} (attempt {attempt + 1}/{max_retries})...")
                
                response = requests.post(url, headers=headers, json=payload, timeout=120)
                response.raise_for_status()
                
                elapsed_time = time.time() - start_time
                logger.info(f"API response received in {elapsed_time:.2f}s")
                
                data = response.json()
                
                # Extract image from response
                if "candidates" in data and len(data["candidates"]) > 0:
                    candidate = data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        for part in candidate["content"]["parts"]:
                            if "inline_data" in part and part["inline_data"].get("mime_type", "").startswith("image/"):
                                image_data = base64.b64decode(part["inline_data"]["data"])
                                logger.info(f"✓ Successfully generated image for {peptide_name} ({len(image_data)} bytes)")
                                return image_data
                
                    logger.warning(f"No image found in response for {peptide_name}")
                    if attempt < max_retries - 1:
                        wait_time = (attempt + 1) * 5
                        logger.info(f"Retrying in {wait_time}s...")
                        time.sleep(wait_time)
            
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 404:  # Model not found, try next model
                    logger.warning(f"Model {model_name} not found, trying next...")
                    break
                elif e.response.status_code == 429:  # Rate limit
                    wait_time = (attempt + 1) * 15
                    logger.warning(f"Rate limited on {model_name}, waiting {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    logger.error(f"HTTP error for {peptide_name} with {model_name}: {e}")
                    if attempt < max_retries - 1:
                        wait_time = (attempt + 1) * 5
                        time.sleep(wait_time)
            except Exception as e:
                logger.error(f"Error generating image for {peptide_name} with {model_name}: {e}")
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 5
                    time.sleep(wait_time)
                else:
                    # Try next model
                    break
        else:
            # If we got here, all retries failed for this model, try next model
            continue
        # If we got here, we successfully got a response (or broke out of retry loop)
        break
    
    return None

def save_image(image_data: bytes, filename: str) -> bool:
    """Save generated image to output directory"""
    try:
        output_path = OUTPUT_DIR / filename
        with open(output_path, 'wb') as f:
            f.write(image_data)
        logger.info(f"Saved image to {output_path}")
        return True
    except Exception as e:
        logger.error(f"Error saving image {filename}: {e}")
        return False

def get_remaining_peptides() -> List[str]:
    """Get list of peptides that still need images"""
    remaining = []
    for peptide in PEPTIDES:
        filename = generate_image_filename(peptide)
        if not (OUTPUT_DIR / filename).exists():
            remaining.append(peptide)
    return remaining

def process_batch(peptides: List[str]) -> Tuple[int, int]:
    """Process a batch of peptides"""
    successful = 0
    failed = 0
    
    for peptide in peptides:
        logger.info(f"\n{'='*60}")
        logger.info(f"Processing: {peptide}")
        logger.info(f"{'='*60}")
        
        strength = get_strength_range(peptide)
        filename = generate_image_filename(peptide)
        
        # Generate image
        image_data = generate_image_with_gemini(peptide, strength)
        
        if image_data:
            # Save image
            if save_image(image_data, filename):
                successful += 1
                logger.info(f"✓ Successfully processed {peptide}")
            else:
                failed += 1
                logger.error(f"✗ Failed to save image for {peptide}")
        else:
            failed += 1
            logger.error(f"✗ Failed to generate image for {peptide}")
        
        # Rate limiting between requests
        time.sleep(2)
    
    return successful, failed

def main():
    """Main execution function"""
    logger.info("="*60)
    logger.info("Vici Peptides Image Generation System")
    logger.info("Using Google Gemini 3 Pro Image Preview")
    logger.info("="*60)
    
    # Verify reference images exist
    if not TEMPLATE_IMAGE.exists():
        logger.error(f"Template image not found: {TEMPLATE_IMAGE}")
        return
    if not LOGO_IMAGE.exists():
        logger.error(f"Logo image not found: {LOGO_IMAGE}")
        return
    
    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Get remaining peptides
    remaining = get_remaining_peptides()
    
    if not remaining:
        logger.info("All images already generated!")
        return
    
    logger.info(f"Total peptides to process: {len(remaining)}")
    logger.info(f"Processing ONE peptide at a time...\n")
    
    # Process single peptide
    peptide = remaining[0]
    logger.info(f"Processing: {peptide}")
    
    strength = get_strength_range(peptide)
    filename = generate_image_filename(peptide)
    
    # Generate image
    image_data = generate_image_with_gemini(peptide, strength)
    
    if image_data:
        # Save image
        if save_image(image_data, filename):
            logger.info(f"\n✓✓✓ SUCCESS! Generated and saved image for {peptide}")
            logger.info(f"   Filename: {filename}")
            logger.info(f"   Location: {OUTPUT_DIR / filename}")
        else:
            logger.error(f"\n✗ Failed to save image for {peptide}")
    else:
        logger.error(f"\n✗ Failed to generate image for {peptide}")
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info("SINGLE PEPTIDE PROCESSING COMPLETE")
    logger.info("="*60)
    logger.info(f"Processed: {peptide}")
    logger.info(f"Remaining: {len(remaining) - 1} peptides")
    logger.info("="*60)
    logger.info(f"\nType 'continue' to process the next peptide.")

if __name__ == "__main__":
    main()

