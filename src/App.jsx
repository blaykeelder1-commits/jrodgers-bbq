import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Catering from './pages/Catering';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import OrderConfirmation from './pages/OrderConfirmation';
import KitchenOrders from './pages/KitchenOrders';
import MobileOrderCTA from './components/MobileOrderCTA';
import './styles/global.css';

function App() {
  return (
    <CartProvider>
      <ToastProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/order" element={<Order />} />
                <Route path="/catering" element={<Catering />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/orders" element={<KitchenOrders />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <MobileOrderCTA />
          <Footer />
        </div>
      </Router>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;
