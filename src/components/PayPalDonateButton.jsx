import React from "react";

const PayPalDonateButton = () => {
  return (
    <div className="text-center mt-6">
      <img src="/gift.png" alt="Support Us" className="w-20 mx-auto my-3" />
      <p className="text-green-300 text-sm font-[Poppins]">Support our project with a small gift!</p>
      <a
        href="https://www.paypal.com/donate/?hosted_button_id=H66NE985RU6BS"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-600 transition font-[Poppins]"
      >
        Gift with PayPal
      </a>
    </div>
  );
};

export default PayPalDonateButton;
