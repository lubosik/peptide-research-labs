/**
 * Product Image Utilities
 * 
 * Functions for getting product images from local storage
 */

/**
 * Get image path for a product
 * Returns local image path for products with images, placeholder for others
 */
export function getProductImage(productName: string, productSlug?: string): string {
  const name = productName.toUpperCase();
  const slug = productSlug?.toUpperCase() || '';

  // 5-amino-1mq
  if (name.includes('5-AMINO-1MQ') || name.includes('5AMINO-1MQ') || name.includes('5 AMINO 1MQ') || slug.includes('5-AMINO-1MQ')) {
    return '/images/products/vici-5-amino-1mq.png';
  }
  
  // ACETIC ACID
  if (name.includes('ACETIC ACID') || name.startsWith('ACETIC ACID') || slug.includes('ACETIC-ACID')) {
    return '/images/products/vici-acetic-acid.png';
  }
  
  // AICAR
  if (name.includes('AICAR') || name.startsWith('AICAR') || slug.includes('AICAR')) {
    return '/images/products/vici-aicar.png';
  }
  
  // AOD9604
  if (name.includes('AOD9604') || name.includes('AOD 9604') || slug.includes('AOD9604')) {
    return '/images/products/vici-aod9604.png';
  }
  
  // ARA 290
  if (name.includes('ARA 290') || name.includes('ARA290') || slug.includes('ARA-290')) {
    return '/images/products/vici-ara-290.png';
  }
  
  // Adipotide
  if (name.includes('ADIPOTIDE') || name.startsWith('ADIPOTIDE') || slug.includes('ADIPOTIDE')) {
    return '/images/products/vici-adipotide.png';
  }
  
  // BPC-157
  if (name.includes('BPC-157') || name.includes('BPC157') || slug.includes('BPC-157')) {
    return '/images/products/vici-bpc-157.png';
  }
  
  // BPC-157 + TB-500
  if ((name.includes('BPC-157') && name.includes('TB-500')) || (name.includes('BPC157') && name.includes('TB500')) || slug.includes('BPC-157-TB-500')) {
    return '/images/products/vici-bpc-157-tb-500.png';
  }
  
  // Bac Water
  if (name.includes('BAC WATER') || name.includes('BACWATER') || name.includes('BAC WATER') || slug.includes('BAC-WATER')) {
    return '/images/products/vici-bac-water.png';
  }
  
  // CJC-1295 (without DAC) 5mg + IPA 5mg
  if ((name.includes('CJC-1295') && name.includes('WITHOUT DAC') && name.includes('IPA')) || slug.includes('CJC-1295-WITHOUT-DAC-5MG-IPA')) {
    return '/images/products/vici-cjc-1295-without-dac-5mg-ipa-5mg.png';
  }
  
  // CJC-1295 with DAC
  if (((name.includes('CJC-1295') && name.includes('WITH DAC')) && !name.includes('WITHOUT')) || slug.includes('CJC-1295-WITH-DAC')) {
    return '/images/products/vici-cjc-1295-with-dac.png';
  }
  
  // CJC-1295 without DAC
  if (((name.includes('CJC-1295') && name.includes('WITHOUT DAC')) && !name.includes('IPA')) || slug.includes('CJC-1295-WITHOUT-DAC')) {
    return '/images/products/vici-cjc-1295-without-dac.png';
  }
  
  // Cagrilintide 5mg + Semaglutide
  if ((name.includes('CAGRILINTIDE') && name.includes('SEMAGLUTIDE')) || slug.includes('CAGRILINTIDE-5MG-SEMAGLUTIDE')) {
    return '/images/products/vici-cagrilintide-5mg-semaglutide.png';
  }
  
  // Cagrilintide
  if (name.includes('CAGRILINTIDE') || slug.includes('CAGRILINTIDE')) {
    return '/images/products/vici-cagrilintide.png';
  }
  
  // Cerebrolysin
  if (name.includes('CEREBROLYSIN') || slug.includes('CEREBROLYSIN')) {
    return '/images/products/vici-cerebrolysin.png';
  }
  
  // DSIP
  if (name.includes('DSIP') || slug.includes('DSIP')) {
    return '/images/products/vici-dsip.png';
  }
  
  // Dermorphin
  if (name.includes('DERMORPHIN') || slug.includes('DERMORPHIN')) {
    return '/images/products/vici-dermorphin.png';
  }
  
  // Epitalon
  if (name.includes('EPITALON') || slug.includes('EPITALON')) {
    return '/images/products/vici-epitalon.png';
  }
  
  // FOXO4
  if (name.includes('FOXO4') || slug.includes('FOXO4')) {
    return '/images/products/vici-foxo4.png';
  }
  
  // GHK-Cu
  if (name.includes('GHK-CU') || name.includes('GHKCU') || name.includes('GHK CU') || slug.includes('GHK-CU')) {
    return '/images/products/vici-ghk-cu.png';
  }
  
  // GHRP-2 Acetate
  if ((name.includes('GHRP-2') && name.includes('ACETATE')) || slug.includes('GHRP-2-ACETATE')) {
    return '/images/products/vici-ghrp-2-acetate.png';
  }
  
  // GHRP-6 Acetate
  if ((name.includes('GHRP-6') && name.includes('ACETATE')) || slug.includes('GHRP-6-ACETATE')) {
    return '/images/products/vici-ghrp-6-acetate.png';
  }
  
  // Glow
  if (name.includes('GLOW') || slug.includes('GLOW')) {
    return '/images/products/vici-glow.png';
  }
  
  // Glutathione
  if (name.includes('GLUTATHIONE') || slug.includes('GLUTATHIONE')) {
    return '/images/products/vici-glutathione.png';
  }
  
  // Gonadorelin Acetate
  if ((name.includes('GONADORELIN') && name.includes('ACETATE')) || slug.includes('GONADORELIN-ACETATE')) {
    return '/images/products/vici-gonadorelin-acetate.png';
  }
  
  // Gonadorelin
  if (name.includes('GONADORELIN') || slug.includes('GONADORELIN')) {
    return '/images/products/vici-gonadorelin.png';
  }
  
  // HCG
  if (name.includes('HCG') || slug.includes('HCG')) {
    return '/images/products/vici-hcg.png';
  }
  
  // HGH
  if (name.includes('HGH') || slug.includes('HGH')) {
    return '/images/products/vici-hgh.png';
  }
  
  // HMG
  if (name.includes('HMG') || slug.includes('HMG')) {
    return '/images/products/vici-hmg.png';
  }
  
  // Hexarelin Acetate
  if ((name.includes('HEXARELIN') && name.includes('ACETATE')) || slug.includes('HEXARELIN-ACETATE')) {
    return '/images/products/vici-hexarelin-acetate.png';
  }
  
  // IGF-1LR3 (no image available)
  // if (name.includes('IGF-1LR3') || name.includes('IGF1LR3') || slug.includes('IGF-1LR3')) {
  //   return '/images/products/vici-igf-1lr3.png';
  // }
  
  // Ipamorelin
  if (name.includes('IPAMORELIN') || slug.includes('IPAMORELIN')) {
    return '/images/products/vici-ipamorelin.png';
  }
  
  // KPV
  if (name.includes('KPV') || slug.includes('KPV')) {
    return '/images/products/vici-kpv.png';
  }
  
  // Kisspeptin-10
  if (name.includes('KISSPEPTIN-10') || name.includes('KISSPEPTIN 10') || slug.includes('KISSPEPTIN-10')) {
    return '/images/products/vici-kisspeptin-10.png';
  }
  
  // Klow
  if (name.includes('KLOW') || slug.includes('KLOW')) {
    return '/images/products/vici-klow.png';
  }
  
  // L-carnitine
  if (name.includes('L-CARNITINE') || name.includes('LCARNITINE') || name.includes('L CARNITINE') || slug.includes('L-CARNITINE')) {
    return '/images/products/vici-l-carnitine.png';
  }
  
  // LL37
  if (name.includes('LL37') || name.includes('LL 37') || slug.includes('LL37')) {
    return '/images/products/vici-ll37.png';
  }
  
  // Lemon Bottle
  if (name.includes('LEMON BOTTLE') || name.includes('LEMONBOTTLE') || slug.includes('LEMON-BOTTLE')) {
    return '/images/products/vici-lemon-bottle.png';
  }
  
  // Lipo-c
  if (name.includes('LIPO-C') || name.includes('LIPOC') || name.includes('LIPO C') || slug.includes('LIPO-C')) {
    return '/images/products/vici-lipo-c.png';
  }
  
  // MGF
  if ((name.includes('MGF') && !name.includes('PEG-MGF')) || (slug.includes('MGF') && !slug.includes('PEG-MGF'))) {
    return '/images/products/vici-mgf.png';
  }
  
  // MOTS-C
  if (name.includes('MOTS-C') || name.includes('MOTSC') || name.includes('MOTS C') || slug.includes('MOTS-C')) {
    return '/images/products/vici-mots-c.png';
  }
  
  // Mazdutide
  if (name.includes('MAZDUTIDE') || slug.includes('MAZDUTIDE')) {
    return '/images/products/vici-mazdutide.png';
  }
  
  // Melanotan I
  if (name.includes('MELANOTAN I') || name.includes('MELANOTANI') || slug.includes('MELANOTAN-I')) {
    return '/images/products/vici-melanotan-i.png';
  }
  
  // Melanotan II
  if (name.includes('MELANOTAN II') || name.includes('MELANOTANII') || slug.includes('MELANOTAN-II')) {
    return '/images/products/vici-melanotan-ii.png';
  }
  
  // Melatonin
  if (name.includes('MELATONIN') || slug.includes('MELATONIN')) {
    return '/images/products/vici-melatonin.png';
  }
  
  // NAD+
  if (name.includes('NAD+') || name.includes('NAD') || slug.includes('NAD')) {
    return '/images/products/vici-nad.png';
  }
  
  // Oxytocin Acetate
  if ((name.includes('OXYTOCIN') && name.includes('ACETATE')) || slug.includes('OXYTOCIN-ACETATE')) {
    return '/images/products/vici-oxytocin-acetate.png';
  }
  
  // PEG-MGF
  if (name.includes('PEG-MGF') || name.includes('PEGMGF') || name.includes('PEG MGF') || slug.includes('PEG-MGF')) {
    return '/images/products/vici-peg-mgf.png';
  }
  
  // PT-141
  if (name.includes('PT-141') || name.includes('PT141') || name.includes('PT 141') || slug.includes('PT-141')) {
    return '/images/products/vici-pt-141.png';
  }
  
  // Retatrutide
  if (name.includes('RETATRUTIDE') || slug.includes('RETATRUTIDE')) {
    return '/images/products/vici-retatrutide.png';
  }
  
  // SS-31
  if (name.includes('SS-31') || name.includes('SS31') || name.includes('SS 31') || slug.includes('SS-31')) {
    return '/images/products/vici-ss-31.png';
  }
  
  // Selank
  if (name.includes('SELANK') || slug.includes('SELANK')) {
    return '/images/products/vici-selank.png';
  }
  
  // Semaglutide
  if (name.includes('SEMAGLUTIDE') || slug.includes('SEMAGLUTIDE')) {
    return '/images/products/vici-semaglutide.png';
  }
  
  // Semax
  if (name.includes('SEMAX') || slug.includes('SEMAX')) {
    return '/images/products/vici-semax.png';
  }
  
  // Sermorelin
  if (name.includes('SERMORELIN') || slug.includes('SERMORELIN')) {
    return '/images/products/vici-sermorelin.png';
  }
  
  // Snap-8
  if (name.includes('SNAP-8') || name.includes('SNAP8') || name.includes('SNAP 8') || slug.includes('SNAP-8')) {
    return '/images/products/vici-snap-8.png';
  }
  
  // Survodutide
  if (name.includes('SURVODUTIDE') || slug.includes('SURVODUTIDE')) {
    return '/images/products/vici-survodutide.png';
  }
  
  // TB-500 (Thymosin B4 Acetate)
  if (((name.includes('TB-500') || name.includes('TB500')) && !name.includes('BPC-157')) || (slug.includes('TB-500') && !slug.includes('BPC-157'))) {
    return '/images/products/vici-tb-500-thymosin-b4-acetate.png';
  }
  
  // Tesamorelin
  if (name.includes('TESAMORELIN') || slug.includes('TESAMORELIN')) {
    return '/images/products/vici-tesamorelin.png';
  }
  
  // Thymalin
  if (name.includes('THYMALIN') || slug.includes('THYMALIN')) {
    return '/images/products/vici-thymalin.png';
  }
  
  // Thymosin Alpha-1
  if (name.includes('THYMOSIN ALPHA-1') || name.includes('THYMOSIN ALPHA 1') || name.includes('THYMOSINALPHA1') || slug.includes('THYMOSIN-ALPHA-1')) {
    return '/images/products/vici-thymosin-alpha-1.png';
  }
  
  // Tirzepatide
  if (name.includes('TIRZEPATIDE') || slug.includes('TIRZEPATIDE')) {
    return '/images/products/vici-tirzepatide.png';
  }
  
  // VIP
  if (name.includes('VIP') || slug.includes('VIP')) {
    return '/images/products/vici-vip.png';
  }
  
  // Placeholder for products without images
  return '/images/products/placeholder.jpg';
}
