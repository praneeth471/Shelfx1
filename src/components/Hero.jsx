import { motion } from 'framer-motion';
import HeroImg from "../assets/heroimg.png"

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="p-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        variants={itemVariants}
        className="big-shoulders-inline-text-h1 text-8xl text-[#EEEEEE] tracking-widest xl:p-4 xl:py-12 xl:mt-6 xl:max-w-2xl lg:max-w-full text-center xl:pl-24 md:mt-16 sm:text-center sm:mt-16"
      >
        Shelf X
      </motion.h1>
      <div className="sm:text-center xl:flex xl:flex-row xl:justify-between lg:flex lg:flex-col lg:gap-32">
        <motion.div 
          variants={itemVariants}
          className="p-4 xl:p-6 xl:pl-32 xl:py-12 xl:mt-8 text-[#EEEEEE] text-2xl xl:max-w-2xl md:px-16 md:max-w-full md:text-center md:mt-16 xl:text-center leading-10 sm:px-16 sm:text-center sm:mt-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-start gap-6 w-full max-w-3xl"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-7xl font-bold text-[#EEEEEE] tracking-tight leading-tight relative"
            >
              Find your <motion.span 
                className="text-[#FFD369] relative inline-block"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                next
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  style={{ height: '16px' }}
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, type: "spring", stiffness: 100 }}
                    d="M5,8 Q30,3 60,8 T115,8"
                    stroke="#FFD369"
                    strokeWidth="2.5"
                    fill="none"
                    className="wavy-line"
                  />
                </svg>
              </motion.span>
              <br />great read here
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-300 max-w-lg font-light leading-relaxed"
            >
              Fast, user-friendly, and engaging - transform your reading experience with our seamless book rental and exchange platform.
            </motion.p>
            <motion.div variants={itemVariants} className="w-full flex items-center justify-center gap-4 mt-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center items-center"
              >
                <dotlottie-player 
                  src="http://lottie.host/4568a68e-712e-46e9-9438-c0ad81ea8533/7C5WvzpoSV.json" 
                  background="transparent" 
                  speed="1" 
                  style={{width: 100, height: 100}} 
                  loop 
                  autoplay
                />
              </motion.div>
              <motion.a 
                href="/login-seller"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center"
              >
                <motion.button
                  type="button"
                  className="text-[#222831] font-medium rounded-lg w-[150px] h-[60px] text-base px-4 py-2 text-center bg-[#FFD369] hover:bg-[#ecd5a0] focus:bg-[#ecc363] transition-colors duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ 
                    backgroundColor: "#ecd5a0",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  Upload a Book
                </motion.button>
              </motion.a>
            </motion.div>
          </motion.div>
          <br />
          <br />
        </motion.div>
        <motion.div 
          variants={itemVariants}
          className="hidden h-full sm:block lg:mt-[-190px] lg:mr-[100px] xl:border-b-8 xl:border-b-[#FFD369] md:border-b-8 md:border-b-[#FFD369] sm:border-b-[#FFD369] sm:border-b-8"
        >
          <motion.img 
            src={HeroImg} 
            alt="vote img" 
            className="transform hover:scale-105 transition-transform duration-300"
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 }
            }}
          />
        </motion.div>
      </div>
      <style jsx>{`
        .wavy-line {
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </motion.div>
  )
}

export default Hero
