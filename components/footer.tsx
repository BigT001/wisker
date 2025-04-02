import React from "react";
import { Cat } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white py-6 mt-auto text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        {/* Centered horizontal line */}
        <div className="flex items-center justify-center mb-4">
          <div className="border-t w-20 border-gray-300"></div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Cat className="h-5 w-5 text-purple-600" />
          <span className="text-lg font-medium text-gray-900">Whisker</span>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Mischievous Cat Shopper Series
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Developed with 💜 by{" "}
            <span className="font-medium text-purple-600">Netcrest</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
