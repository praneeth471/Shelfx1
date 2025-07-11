import { motion } from 'framer-motion';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <motion.section 
      className="bg-[#222831] py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div 
        variants={itemVariants}
        className="lg:max-w-full xl:max-w-screen-md mb-8 lg:mb-16 xl:pl-32 lg:text-center sm:text-center xl:text-start"
      >
        <motion.h2 
          variants={itemVariants}
          className="mb-4 text-4xl tracking-tight font-extrabold text-white"
        >
          Empower Your Voice with Innovative Voting Features
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-gray-500 sm:text-xl"
        >
          Discover a suite of powerful tools designed to make voting easier, more secure, and accessible for everyone.
        </motion.p>
      </motion.div>
      <div className="py-8 mx-auto max-w-screen-xl sm:py-16 sm:px-8 lg:px-6">
        <motion.div 
          variants={containerVariants}
          className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0"
        >
          {/* Feature 1 */}
          <motion.div 
            variants={itemVariants}
            className="group p-6 bg-[#393E46] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div 
              variants={iconVariants}
              whileHover="hover"
              className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-[#FFD369] bg-opacity-10 lg:h-14 lg:w-14"
            >
              <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 502.664 502.664" xmlSpace="preserve" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <g>
                      <path style={{ fill: '#FFD369' }} d="M132.099,230.872c55.394,0,100.088-44.759,100.088-99.937c0-55.243-44.673-99.981-100.088-99.981 c-55.135,0-99.808,44.738-99.808,99.981C32.291,186.091,76.965,230.872,132.099,230.872z"></path>
                      <path style={{ fill: '#FFD369' }} d="M212.3,247.136H52.072C23.469,247.136,0,273.431,0,305.636v160.896 c0,1.769,0.841,3.387,1.014,5.177h262.387c0.108-1.79,0.949-3.408,0.949-5.177V305.636 C264.35,273.431,240.967,247.136,212.3,247.136z"></path>
                      <path style={{ fill: '#FFD369' }} d="M502.664,137.751c-0.108-58.673-53.711-105.934-119.33-105.783 c-65.92,0.108-119.092,47.758-119.006,106.279c0.108,46.226,33.478,85.334,79.812,99.722l0.626,202.55l38.676,27.826 l40.208-28.064l-0.065-26.877h-18.572l-0.086-26.338h18.616l-0.173-29.121h-18.486l-0.086-26.295h18.572l-0.086-26.316h-18.551 l-0.065-26.316l18.637-0.022l-0.302-41.157C469.402,223.279,502.664,184.02,502.664,137.751z M383.399,77.612 c14.776,0,26.899,12.101,26.899,26.856c0.108,14.949-12.015,27.007-26.834,27.007c-14.905,0-26.942-11.886-26.942-26.877 C356.436,89.778,368.494,77.655,383.399,77.612z"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </motion.div>
            <motion.h3 
              variants={itemVariants}
              className="mb-2 text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors duration-300"
            >
              Two-Factor Authentication
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              Protect your vote with our robust two-factor authentication, ensuring only you can access your voting account.
            </motion.p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            variants={itemVariants}
            className="group p-6 bg-[#393E46] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div 
              variants={iconVariants}
              whileHover="hover"
              className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-[#FFD369] bg-opacity-10 lg:h-14 lg:w-14"
            >
              <svg height="300px" width="300px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <style type="text/css">
                    {`.st0 { fill: #FFD369; }`}
                  </style>
                  <g>
                    <path className="st0" d="M195.928,376.064H148.67l-43.168,82.738H512l-43.168-82.738h-42.957l9.478,28.779h-28.799L364.51,185.406 c0,0-5.038,1.349-12.576,3.281l-0.52-2.614c-0.928-4.518-2.642-8.621-4.68-12.527c-2.051-3.9-4.441-7.581-6.914-11.01l-0.716-0.991 l-0.899-0.78c-5.677-5.017-15.949-13.237-33.402-24.598l0.042,0.028c-18.274-11.945-38.938-18.345-56.946-18.774 c-38.826-0.801-81.727-1.68-93.2-1.911l-10.856-6.984l6.415-9.465L83.967,53.197L0,178.176l65.525,45.852l8.796-12.971 l22.414,15.141l32.298,48.009c4.771,7.082,11.27,12.871,18.908,16.757l0.077,0.042c0.014,0,5.754,2.867,13.82,6.942 c8.052,4.075,18.416,9.359,27.556,14.158l0.014,0.007c7.364,3.85,15.725,7.194,24.563,10.146l0.112,0.035l5.621,1.743 l15.569,80.806h-29.769L195.928,376.064z M220.757,301.771c-8.031-2.684-15.408-5.67-21.345-8.782h0.014 c-18.422-9.66-41.285-21.05-41.742-21.282c-4.286-2.185-8.044-5.522-10.742-9.542l-34.638-51.501l-25.87-17.474l45.29-66.789 l16.441,10.568l3.049,0.056c0.028,0.007,12.745,0.267,31.14,0.64c18.401,0.379,42.465,0.871,65.103,1.342 c13.089,0.204,30.795,5.466,45.528,15.218l0.45,0.295l-0.407-0.267c15.696,10.23,24.9,17.509,29.93,21.865 c0.619,0.871,1.209,1.742,1.771,2.614l-29.776,2.494l-36.605,13.251l-1.398,1.124c-11.755,9.436-18.682,23.6-18.921,38.636v0.681 c-0.006,14.846,6.506,28.94,17.825,38.552l2.382,2.016l0.295,0.042c0.886,0.717,2.122,1.728,3.921,3.239 c4.026,3.379,10.651,9.028,21.443,18.401c1.982,1.721,3.106,3.274,3.738,4.56c0.639,1.293,0.836,2.326,0.844,3.337 c0.014,2.108-1.082,4.722-3.865,7.103c-2.74,2.333-6.913,4.054-11.719,4.047c-1.939,0-3.977-0.267-6.113-0.885l-0.498-0.14 l0.541,0.154c-8.347-2.445-17.143-4.798-25.743-7.285L220.757,301.771z"></path>
                  </g>
                </g>
              </svg>
            </motion.div>
            <motion.h3 
              variants={itemVariants}
              className="mb-2 text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors duration-300"
            >
              Vote Tallying
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              Our system meticulously matches votes conducted by voting officials with those cast by voters, ensuring integrity and accuracy.
            </motion.p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            variants={itemVariants}
            className="group p-6 bg-[#393E46] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div 
              variants={iconVariants}
              whileHover="hover"
              className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-[#FFD369] bg-opacity-10 lg:h-14 lg:w-14"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Warning / Stop_Sign">
                    <path 
                      id="Vector" 
                      d="M5.75 5.75L18.25 18.25M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" 
                      stroke="#FFD369" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </g>
              </svg>
            </motion.div>
            <motion.h3 
              variants={itemVariants}
              className="mb-2 text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors duration-300"
            >
              Single Vote Restriction
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              We enforce a strict single vote restriction to maintain the integrity of the election, ensuring each participant can only vote once.
            </motion.p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            variants={itemVariants}
            className="group p-6 bg-[#393E46] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div 
              variants={iconVariants}
              whileHover="hover"
              className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-[#FFD369] bg-opacity-10 lg:h-14 lg:w-14"
            >
              <svg fill="#FFD369" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" stroke="#FFD369">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M25 24.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5zM23.5 12h2c.277 0 .5.223.5.5s-.223.5-.5.5h-2c-.277 0-.5-.223-.5-.5s.223-.5.5-.5zm-3-2c-.822 0-1.5.678-1.5 1.5v14c0 .822.678 1.5 1.5 1.5h8c.822 0 1.5-.678 1.5-1.5v-14c0-.822-.678-1.5-1.5-1.5zm0 1h8c.286 0 .5.214.5.5v14c0 .286-.214.5-.5.5h-8c-.286 0-.5-.214-.5-.5v-14c0-.286.214-.5.5-.5zM14 19.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5zM1.5 3C.678 3 0 3.678 0 4.5v16c0 .822.678 1.5 1.5 1.5H11v2H9.5c-.277 0-.5.223-.5.5s.223.5.5.5h8c.277 0 .5-.223.5-.5s-.223-.5-.5-.5H16v-2h1.5c.668 0 .656-1 0-1h-16c-.286 0-.5-.214-.5-.5V18h16.5c.277 0 .5-.223.5-.5s-.223-.5-.5-.5H1V4.5c0-.286.214-.5.5-.5h24c.286 0 .5.214.5.5v4c0 .665 1 .657 1 0v-4c0-.822-.678-1.5-1.5-1.5zM12 22h3v2h-3z"></path>
                </g>
              </svg>
            </motion.div>
            <motion.h3 
              variants={itemVariants}
              className="mb-2 text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors duration-300"
            >
              Responsive Design
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              Our platform features a fully responsive design, ensuring a seamless voting experience on desktops, tablets, and smartphones.
            </motion.p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div 
            variants={itemVariants}
            className="group p-6 bg-[#393E46] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div 
              variants={iconVariants}
              whileHover="hover"
              className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-[#FFD369] bg-opacity-10 lg:h-14 lg:w-14"
            >
              <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <title>interface / 16 - interface, align items, bottom, align icon</title>
                  <g id="Free-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="translate(-1265.000000, -600.000000)" id="Group" stroke="#FFD369" strokeWidth="2">
                      <g transform="translate(1263.000000, 598.000000)" id="Shape">
                        <path d="M17,5 L17,15 C17,16.1045695 16.1045695,17 15,17 L9,17 C7.8954305,17 7,16.1045695 7,15 L7,5 C7,3.8954305 7.8954305,3 9,3 L15,3 C16.1045695,3 17,3.8954305 17,5 Z"></path>
                        <line x1="21" y1="21" x2="3" y2="21"></line>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </motion.div>
            <motion.h3 
              variants={itemVariants}
              className="mb-2 text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors duration-300"
            >
              User-Friendly Interface
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              Our intuitive design empowers voting conductors to easily input voter data and manage election details with minimal effort.
            </motion.p>
          </motion.div>

          {/* Feature 6 */}
          <motion.div 
            variants={itemVariants}
            className="group p-6 bg-[#393E46] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div 
              variants={iconVariants}
              whileHover="hover"
              className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-[#FFD369] bg-opacity-10 lg:h-14 lg:w-14"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="" stroke="">
                <defs>
                  <style>
                    {`.cls-1 { fill: none; stroke: #FFD369; stroke-miterlimit: 10; stroke-width: 1.91px; }`}
                  </style>
                </defs>
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <circle className="cls-1" cx="9.61" cy="5.8" r="4.3"></circle>
                  <path className="cls-1" d="M1.5,19.64l.7-3.47a7.56,7.56,0,0,1,7.41-6.08,7.48,7.48,0,0,1,4.6,1.57"></path>
                  <circle className="cls-1" cx="16.77" cy="16.77" r="5.73"></circle>
                  <polyline className="cls-1" points="19.64 14.86 16.3 18.2 14.39 16.3"></polyline>
                </g>
              </svg>
            </motion.div>
            <motion.h3 
              variants={itemVariants}
              className="mb-2 text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors duration-300"
            >
              Voter Authentication
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
            >
              Each voter is authenticated based on phone numbers provided by voting conductors, ensuring only eligible participants can cast their vote.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;
  