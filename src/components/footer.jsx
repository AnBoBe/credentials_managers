import React from "react";

const Footer = () => {
  return (
    <footer className="text-gray-400 bg-bgb body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a
          href="/home"
          className="flex title-font font-medium items-center md:justify-start justify-center text-white"
        >
          <span className="ml-3 text-xl italic">MediaMakers</span>
        </a>

        <p className="text-sm text-gray-400 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-800 sm:py-2 sm:mt-0 mt-4">
          © MediaMakers —
          <a
            href="#"
            className="text-gray-500 ml-1"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
