const http = require('http');

function postJSON(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runVerification() {
  console.log('--- STARTING TECHNICAL VERIFICATION ---');

  // Test 1: Bridal Lehenga
  const t1 = await postJSON('http://localhost:5000/api/ai/customer/generate-dress', {
    dressType: 'Bridal Lehenga',
    occasion: 'Wedding',
    fabric: 'Banarasi Silk',
    colors: 'Maroon + Antique Gold',
    neckStyle: 'Sweetheart Royal',
    sleeveStyle: 'Elbow Length',
    embellishment: 'Intricate Zardozi & Dabka Needlework',
    customRequirements: 'Heavy traditional embroidery with a modern silhouette'
  });

  console.log('\n[TEST 1 - Bridal Lehenga]');
  console.log('Status:', t1.status);
  console.log('Concept ID:', t1.data.id);
  console.log('Model Used:', t1.data.geminiModelUsed);
  console.log('Custom Req in Prompt:', t1.data.prompt.split('Custom requirement:\n')[1].split('\n\n')[0]);
  console.log('Image Data Length:', t1.data.imageUrl ? t1.data.imageUrl.length : 0);
  console.log('Is Image Valid Data URI:', t1.data.imageUrl && t1.data.imageUrl.startsWith('data:image/'));

  // Test 2: Pastel Blue Modern Anarkali
  const t2 = await postJSON('http://localhost:5000/api/ai/customer/generate-dress', {
    dressType: 'Floor-Length Anarkali Gown',
    occasion: 'Sangeet & Mehendi Night',
    fabric: 'Lightweight Cotton',
    colors: 'Pastel Sky Blue & Silver',
    neckStyle: 'Boat Neck Elegance',
    sleeveStyle: 'Full Illusion Net with Motifs',
    embellishment: 'Minimalist Floral Resham',
    customRequirements: 'Create a pastel blue modern Anarkali using lightweight cotton with minimal floral embroidery'
  });

  console.log('\n[TEST 2 - Pastel Blue Anarkali]');
  console.log('Status:', t2.status);
  console.log('Concept ID:', t2.data.id);
  console.log('Model Used:', t2.data.geminiModelUsed);
  console.log('Custom Req in Prompt:', t2.data.prompt.split('Custom requirement:\n')[1].split('\n\n')[0]);
  console.log('Image Data Length:', t2.data.imageUrl ? t2.data.imageUrl.length : 0);
  console.log('Prompts Differ Between Test 1 & 2:', t1.data.prompt !== t2.data.prompt);
  console.log('Images Differ Between Test 1 & 2:', t1.data.imageUrl !== t2.data.imageUrl);

  // Test 3: Black Contemporary Saree
  const t3 = await postJSON('http://localhost:5000/api/ai/customer/generate-dress', {
    dressType: 'Contemporary Saree',
    occasion: 'Reception & Cocktail Gala',
    fabric: 'Chanderi Tissue Silk',
    colors: 'Charcoal Black & Silver',
    neckStyle: 'Queen Anne Corset',
    sleeveStyle: 'Sleeveless with Hand Piping',
    embellishment: 'Silver Geometric Patterns',
    customRequirements: 'Create a black contemporary saree with silver geometric patterns and a modern blouse'
  });

  console.log('\n[TEST 3 - Black Contemporary Saree]');
  console.log('Status:', t3.status);
  console.log('Concept ID:', t3.data.id);
  console.log('Model Used:', t3.data.geminiModelUsed);
  console.log('Custom Req in Prompt:', t3.data.prompt.split('Custom requirement:\n')[1].split('\n\n')[0]);
  console.log('Image Data Length:', t3.data.imageUrl ? t3.data.imageUrl.length : 0);
  console.log('Prompts Differ Between Test 2 & 3:', t2.data.prompt !== t3.data.prompt);
  console.log('Images Differ Between Test 2 & 3:', t2.data.imageUrl !== t3.data.imageUrl);

  // Test 4: Regenerate Test (Fresh Request with Same Inputs produces Fresh Concept ID)
  const t4 = await postJSON('http://localhost:5000/api/ai/customer/generate-dress', {
    dressType: 'Contemporary Saree',
    occasion: 'Reception & Cocktail Gala',
    fabric: 'Chanderi Tissue Silk',
    colors: 'Charcoal Black & Silver',
    neckStyle: 'Queen Anne Corset',
    sleeveStyle: 'Sleeveless with Hand Piping',
    embellishment: 'Silver Geometric Patterns',
    customRequirements: 'Create a black contemporary saree with silver geometric patterns and a modern blouse'
  });

  console.log('\n[TEST 4 - Regenerate Fresh Request]');
  console.log('Status:', t4.status);
  console.log('Concept ID:', t4.data.id);
  console.log('Is Concept ID Fresh Compared to Test 3:', t4.data.id !== t3.data.id);
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
