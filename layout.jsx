import './globals.css';

export const metadata = {
  title: 'Automated AI Form Filler | Enterprise Vault & Exam Launcher',
  description: 'Zero-persistence encrypted vault upload and automated exam form filling console.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
