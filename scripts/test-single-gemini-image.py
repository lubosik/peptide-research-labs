#!/usr/bin/env python3
"""
Test single Gemini image generation with perfect API request
"""

import os
import base64
import requests
import json
import time
from pathlib import Path

# Configuration
GEMINI_API_KEY = "AIzaSyCYLFiW25zruuPedV___o16_51vlVh5SBM"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent"

# Paths
DOWNLOADS_PATH = Path.home() / "Downloads"
TEMPLATE_IMAGE = DOWNLOADS_PATH / "Vici Peptides Site-USE-TEMPLATE+.jpg"
LOGO_IMAGE = DOWNLOADS_PATH / "Vici Peptides Logo NEW.png"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "images" / "products"

def load_image_base64(image_path):
    """Load image and return base64 string without data URI prefix"""
    with open(image_path, 'rb') as f:
        image_data = f.read()
        return base64.b64encode(image_data).decode('utf-8')

def main():
    print("="*60)
    print("Testing Single Gemini Image Generation")
    print("="*60)
    
    # Verify images exist
    if not TEMPLATE_IMAGE.exists():
        print(f"ERROR: Template not found: {TEMPLATE_IMAGE}")
        return
    if not LOGO_IMAGE.exists():
        print(f"ERROR: Logo not found: {LOGO_IMAGE}")
        return
    
    print(f"✓ Template found: {TEMPLATE_IMAGE}")
    print(f"✓ Logo found: {LOGO_IMAGE}")
    
    # Load images
    print("\nLoading images...")
    template_base64 = load_image_base64(TEMPLATE_IMAGE)
    logo_base64 = load_image_base64(LOGO_IMAGE)
    print(f"✓ Template loaded: {len(template_base64)} chars")
    print(f"✓ Logo loaded: {len(logo_base64)} chars")
    
    # Create prompt
    peptide_name = "5-amino-1mq"
    strength = "10 mg"
    prompt = f"""Generate a photorealistic 3-D render of a clear glass peptide vial standing upright on an ivory background (#F6F1EB) with soft diffused studio lighting from the upper left. The vial has a metallic silver matte cap and a curved transparent body showing a faint colorless liquid. Apply a centered ivory label displaying the Vici Peptides logo in charcoal serif text, followed by the peptide name {peptide_name} and dosage {strength}, and beneath that the lines '99 % Purity' and 'For Research Purposes Only'. The label must appear professionally printed with clean alignment and correct curvature around the bottle. No reflections, no clutter, no colored backgrounds. Photorealistic product photography style, 1 : 1 framing, pure ivory background."""
    
    # Prepare payload - using correct Gemini API format
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": template_base64
                    }
                },
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": logo_base64
                    }
                }
            ]
        }],
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
    
    url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
    
    print(f"\n{'='*60}")
    print("Sending API Request...")
    print(f"URL: {GEMINI_API_URL}")
    print(f"Peptide: {peptide_name}")
    print(f"{'='*60}\n")
    
    try:
        start_time = time.time()
        print("⏳ Waiting for API response (this may take 30-60 seconds)...")
        
        response = requests.post(url, headers=headers, json=payload, timeout=120)
        
        elapsed = time.time() - start_time
        print(f"✓ Response received in {elapsed:.2f} seconds")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"\n❌ ERROR: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return
        
        data = response.json()
        
        # Debug: print response structure
        print(f"\nResponse keys: {list(data.keys())}")
        
        # Extract image
        if "candidates" in data and len(data["candidates"]) > 0:
            candidate = data["candidates"][0]
            print(f"Candidate keys: {list(candidate.keys())}")
            
            if "content" in candidate:
                content = candidate["content"]
                print(f"Content keys: {list(content.keys())}")
                
                if "parts" in content:
                    for i, part in enumerate(content["parts"]):
                        print(f"Part {i} keys: {list(part.keys())}")
                        if "inline_data" in part:
                            mime_type = part["inline_data"].get("mime_type", "")
                            if mime_type.startswith("image/"):
                                image_data = base64.b64decode(part["inline_data"]["data"])
                                print(f"\n✓✓✓ SUCCESS! Image generated!")
                                print(f"   Size: {len(image_data)} bytes")
                                print(f"   MIME type: {mime_type}")
                                
                                # Save image
                                OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
                                filename = "vici-5-amino-1mq.png"
                                output_path = OUTPUT_DIR / filename
                                
                                with open(output_path, 'wb') as f:
                                    f.write(image_data)
                                
                                print(f"   Saved to: {output_path}")
                                print(f"\n{'='*60}")
                                print("✅ IMAGE GENERATION COMPLETE!")
                                print(f"{'='*60}")
                                return
        
        print(f"\n❌ No image found in response")
        print(f"Full response: {json.dumps(data, indent=2)[:1000]}")
        
    except requests.exceptions.Timeout:
        print("\n❌ ERROR: Request timed out after 120 seconds")
    except requests.exceptions.RequestException as e:
        print(f"\n❌ ERROR: {e}")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

