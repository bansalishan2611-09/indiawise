const fs = require('fs');
const path = require('path');

const pages = [
  'faq',
  'contact',
  'editorial-policy',
  'privacy-policy',
  'terms',
  'disclaimer',
  'advertising-disclosure'
];

pages.forEach(p => {
  const dir = path.join(__dirname, 'src', 'app', p);
  fs.mkdirSync(dir, { recursive: true });
  
  const content = `
export default function ${p.replace(/-/g, '')}Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-bold text-navy capitalize mb-4">${p.replace(/-/g, ' ')}</h1>
      <p className="text-xl text-muted max-w-2xl mx-auto">
        This page is currently under construction and will be built in Phase 3.
      </p>
    </div>
  );
}
  `.trim();
  
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});

console.log('Stubs created successfully.');
