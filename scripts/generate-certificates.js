const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const certificatesDir = path.join(__dirname, '../certificates');

// Ensure certificates directory exists
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

// Function to generate certificates using mkcert
async function generateCertificates() {
  try {
    console.log('Generating certificates using mkcert...');

    // Get server names from environment
    const serverNames = (process.env.SERVER_NAMES || 'localhost').split(',').map(name => name.trim());
    
    // Add localhost if not present
    if (!serverNames.includes('localhost')) {
      serverNames.push('localhost');
    }

    // Generate certificates using mkcert
    const certPath = path.join(certificatesDir, 'localhost.pem');
    const keyPath = path.join(certificatesDir, 'localhost-key.pem');
    
    console.log('Generating certificates for domains:', serverNames.join(', '));
    
    // Create certificate and private key
    execSync(`mkcert -cert-file "${certPath}" -key-file "${keyPath}" ${serverNames.join(' ')}`, {
      stdio: 'inherit'
    });

    console.log('\nCertificates generated successfully!');
    console.log('Certificate files:');
    console.log(`- Certificate: ${certPath}`);
    console.log(`- Private key: ${keyPath}`);
    
    // Add reminder for hosts file
    console.log('\nReminder: Add these lines to your hosts file (C:\\Windows\\System32\\drivers\\etc\\hosts):');
    serverNames.forEach(name => {
      if (name !== 'localhost') {
        console.log(`127.0.0.1 ${name}`);
      }
    });

  } catch (error) {
    console.error('Error generating certificates:', error.message);
    console.log('\nMake sure mkcert is installed. Run:');
    console.log('1. Open PowerShell as Administrator');
    console.log('2. Run: .\\scripts\\install-mkcert.ps1');
    process.exit(1);
  }
}

generateCertificates();
