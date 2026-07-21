import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Hallmark Business and Management Review (HBMR)',
  description: 'Hallmark Business and Management Review (HBMR) - A biannual, peer-reviewed online journal published by Hallmark Business School, Tamil Nadu. Promoting high-quality research in business and management.',
  keywords: 'HBMR, Hallmark Business School, Business Review, Management Review, Academic Journal, Peer-Reviewed, Research, Tamil Nadu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <div className="app">
          <Header />
          <div className="app-content">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
