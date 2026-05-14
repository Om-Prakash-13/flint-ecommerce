import {
  Menu,
  User,
  ShoppingCart,
  Sun,
  Moon,
  Search,
} from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";

import {
  toggleAuthPopup,
  toggleCart,
  toggleSearchBar,
  toggleSidebar,
} from "../../store/slices/popupSlice";

const iconBtn =
  "p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);

  const cartItemsCount =
    cart?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-background/85
        backdrop-blur-xl
        border-b border-border
      "
    >
      <div className="relative max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          {/* left */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className={iconBtn}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          {/* true centered logo */}
          <h1
            className="
              absolute
              left-1/2
              -translate-x-1/2
              text-2xl
              font-bold
              tracking-[0.35em]
              text-primary
              select-none
            "
          >
            FLINT.
          </h1>

          {/* right */}
          <div className="flex items-center gap-1">

            <button
              onClick={toggleTheme}
              className={iconBtn}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            <button
              onClick={() =>
                dispatch(toggleSearchBar())
              }
              className={iconBtn}
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            <button
              onClick={() =>
                dispatch(toggleAuthPopup())
              }
              className={iconBtn}
            >
              <User className="w-5 h-5 text-foreground" />
            </button>

            <button
              onClick={() =>
                dispatch(toggleCart())
              }
              className={`${iconBtn} relative`}
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />

              {cartItemsCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    flex
                    items-center
                    justify-center
                    w-5
                    h-5
                    rounded-full
                    bg-primary
                    text-primary-foreground
                    text-xs
                    font-medium
                  "
                >
                  {cartItemsCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;