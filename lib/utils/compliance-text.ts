/**
 * Compliance Text Utilities
 * 
 * Extracts and provides compliance text from the compliance guidelines document.
 */

// Compliance text placeholders and their actual content
// These should be extracted from the compliance-guidelines.md file

export const COMPLIANCE_TEXT: Record<string, string> = {
  COMPLIANCE_BANNER_TEXT: `All products sold on this website are for Research Use Only (RUO). Not for human or veterinary use. Not approved by the FDA for any therapeutic purpose.`,
  
  RUO_DISCLAIMER: `This product is sold for Research Use Only. Not for human or veterinary consumption. Not approved by the FDA.`,
  
  NOT_FDA_APPROVED: `This product has not been evaluated by the Food and Drug Administration (FDA). It is not approved for human or veterinary use, diagnosis, treatment, cure, or prevention of any disease.`,
  
  NO_MEDICAL_ADVICE: `The information provided on this website is for research and educational purposes only. This information does not constitute medical advice, diagnosis, or treatment. Consult with qualified healthcare professionals for medical guidance.`,
  
  USE_AT_OWN_RISK: `Products are sold "as is" without warranty. The buyer assumes all risk and liability for the results obtained by the use of any product. Use at your own risk.`,
  
  AGE_GATE_TEXT: `You must be 18 years or older to access this website. By continuing, you confirm that you are of legal age and are purchasing these products strictly for laboratory research purposes only. These products are not for human or veterinary use.`,
  
  RESEARCH_REFERENCE_ONLY: `The information in this article is for research and reference purposes only. It does not constitute medical advice or recommendations for human or veterinary use.`,
  
  RUO_CLAUSE: `All products are sold strictly for Research Use Only (RUO). They are not intended for human consumption, medical use, veterinary use, or any diagnostic or therapeutic purposes. These products are not approved by the FDA.`,
  
  LIABILITY_LIMITS: `Vici Peptides makes no warranties, express or implied, about the merchantability or fitness for a particular purpose of its products. The buyer assumes all risk and liability for the results obtained by the use of any product.`,
  
  BUYER_RESPONSIBILITY: `The buyer is solely responsible for ensuring that the purchase and use of products comply with all applicable local, state, and federal laws and regulations. This includes import regulations, research licensing, and safe handling practices.`,
};

/**
 * Get compliance text by key
 */
export function getComplianceText(key: string): string {
  return COMPLIANCE_TEXT[key] || `[${key}]`;
}

/**
 * Replace compliance placeholders in text
 */
export function replaceCompliancePlaceholders(text: string): string {
  let result = text;
  Object.entries(COMPLIANCE_TEXT).forEach(([key, value]) => {
    const placeholder = `[${key}]`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  });
  return result;
}

/**
 * Check if text contains compliance placeholders
 */
export function hasCompliancePlaceholders(text: string): boolean {
  return Object.keys(COMPLIANCE_TEXT).some((key) => 
    text.includes(`[${key}]`)
  );
}
