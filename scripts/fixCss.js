const fs = require("fs");
const css = `@import "tailwindcss";

:root {
  --background-primary: #F8FAFC;
  --background-secondary: #FFFFFF;
  --background-alternate: #F1F5F9;
  
  --foreground: #0F172A;
  --foreground-muted: #64748B;
  
  --color-primary: #0F172A;
  --color-brand: #2563EB;
  --color-brand-hover: #3B82F6;
  
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error: #DC2626;
  
  --border-color: #E2E8F0;
}

@theme inline {
  --color-background: var(--background-primary);
  --color-foreground: var(--foreground);
  --color-muted: var(--foreground-muted);
  
  --color-navy: var(--color-primary);
  --color-brand: var(--color-brand);
  --color-brand-hover: var(--color-brand-hover);
  
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-error: var(--color-error);
  
  --color-card: var(--background-secondary);
  --color-alt: var(--background-alternate);
  
  --color-border: var(--border-color);

  --font-sans: var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

body {
  background-color: var(--background-primary);
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Subtle Engineering Grid Background */
.bg-grid-pattern {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
}

.bg-grid-pattern-light {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
`;
fs.writeFileSync("src/app/globals.css", css);

