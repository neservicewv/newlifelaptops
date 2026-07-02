import './globals.css';

export const metadata = {
  title: 'New Life Laptops',
  description: 'Certified refurbished computers – West Virginia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
