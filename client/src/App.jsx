import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ThemeProvider }
  from "./contexts/ThemeContext";

import {
  ToastContainer,
} from "react-toastify";

import MainLayout
  from "./components/Layout/MainLayout";


// pages
import Index from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <ThemeProvider>

      <BrowserRouter>

        <Routes>

          <Route
            element={<MainLayout />}
          >

            <Route
              path="/"
              element={<Index />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/product/:id"
              element={
                <ProductDetail />
              }
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/faq"
              element={<FAQ />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="*"
              element={
                <NotFound />
              }
            />

          </Route>

        </Routes>


        <ToastContainer
          position="top-right"
          autoClose={3000}
        />

      </BrowserRouter>

    </ThemeProvider>
  );
};

export default App;