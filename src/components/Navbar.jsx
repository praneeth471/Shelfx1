import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/logo.png";
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const isSignUpPage = location.pathname === '/login-seller';

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-[#393E46] border-gray-200 sm:mb-8 lg:mb-0 md:mb-0 w-full"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <motion.a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src={logo}
            className="h-8 mb-2"
            alt="Flowbite Logo"
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <span className="self-center text-3xl big-shoulders-inline-text-nav whitespace-nowrap text-[#EEEEEE] tracking-widest">
            ShelfX
          </span>
        </motion.a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {!isSignUpPage && (
            <motion.a 
              href='/login-seller'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                type="button"
                className="text-[#222831] font-medium rounded-lg text-sm px-4 py-2 text-center bg-[#FFD369] hover:bg-[#FFD369] focus:bg-[#ecc363]"
                whileHover={{ backgroundColor: "#ecc363" }}
                transition={{ duration: 0.2 }}
              >
                Login
              </motion.button>
            </motion.a>
          )}
          <motion.button
            onClick={handleMenuToggle}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            whileTap={{ scale: 0.95 }}
            aria-controls="navbar-cta"
            aria-expanded={menuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </motion.button>
        </div>
        <AnimatePresence>
          <motion.div
            className={`items-center justify-between ${menuOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
            id="navbar-cta"
            variants={menuVariants}
            initial="closed"
            animate={menuOpen ? "open" : "closed"}
          >
          <motion.ul 
            className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-[#393E46] text-center"
          >
            <motion.li variants={menuItemVariants}>
              <motion.a
                href="#"
                className="block py-2 px-3 md:p-0 text-[#EEEEEE] rounded hover:text-[#FFD369]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About Us
              </motion.a>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <motion.a
                href="#"
                className="block py-2 px-3 md:p-0 text-[#EEEEEE] rounded hover:text-[#FFD369]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.a>
            </motion.li>
          </motion.ul>
        </motion.div>
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
