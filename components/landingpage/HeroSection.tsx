'use client';

const Hero = () => {
  return (
    <div
      className="relative bg-cover bg-[url(/public/landing.jpg)] bg-center h-screen flex flex-col justify-center items-center text-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
          Nourish Your Body, <br />
          <span className="text-yellow-400">Elevate Your Life</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6">
          Discover the best way to maintain a healthy lifestyle with our expert guidance.
        </p>
  
      </div>
    </div>
  );
};

export default Hero;