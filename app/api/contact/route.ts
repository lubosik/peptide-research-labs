import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Type for contact submission
interface ContactSubmission {
  firstName: string;
  lastName?: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

// Path to store submissions (temporary JSON file)
const SUBMISSIONS_FILE = path.join(process.cwd(), 'data', 'contact_submissions.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read existing submissions
function readSubmissions(): ContactSubmission[] {
  ensureDataDirectory();
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    return [];
  }
  try {
    const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

// Save submission
function saveSubmission(submission: ContactSubmission) {
  const submissions = readSubmissions();
  submissions.push(submission);
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create submission object
    const submission: ContactSubmission = {
      firstName,
      lastName: lastName || '',
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    };

    // Save to local JSON file (temporary storage)
    saveSubmission(submission);

    // Prepare for Web3Forms integration (placeholder)
    // TODO: Replace with actual Web3Forms API key when ready
    const web3FormsData = {
      access_key: process.env.WEB3FORMS_ACCESS_KEY || 'your-access-key-here',
      subject: `Contact Form: ${subject}`,
      from_name: `${firstName} ${lastName || ''}`.trim(),
      email: email,
      message: message,
    };

    // Placeholder: Uncomment when Web3Forms API key is configured
    /*
    try {
      const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(web3FormsData),
      });

      if (!web3FormsResponse.ok) {
        console.error('Web3Forms submission failed');
      }
    } catch (error) {
      console.error('Error submitting to Web3Forms:', error);
      // Continue anyway - we've saved locally
    }
    */

    return NextResponse.json(
      { success: true, message: 'Message received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

