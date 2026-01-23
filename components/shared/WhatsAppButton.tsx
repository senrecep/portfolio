"use client";

export function WhatsAppButton() {
  const phoneNumber = "905319649002"; // +90531 964 9002 formatted for WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="WhatsApp ile iletişime geç"
    >
      <div className="relative">
        {/* Main button with WhatsApp logo */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ease-out">
          {/* WhatsApp SVG Icon */}
          <svg
            viewBox="0 0 32 32"
            className="w-8 h-8"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 0C7.164 0 0 7.163 0 16c0 2.825.736 5.478 2.026 7.772L0 32l8.448-2.016A15.928 15.928 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm9.375 22.734c-.387 1.094-2.287 2.051-3.146 2.125-.838.074-1.661.396-5.602-1.174-5.036-2.01-8.289-7.115-8.54-7.438-.25-.324-2.062-2.75-2.062-5.25 0-2.5 1.312-3.726 1.776-4.238.464-.511 1.012-.639 1.35-.639.338 0 .676.006.974.018.313.012.738-.119 1.154.88.417.999 1.424 3.474 1.549 3.725.125.25.208.542.042.866-.167.324-.25.527-.5.815-.25.288-.525.644-.75.865-.25.25-.51.526-.219.976.291.449 1.297 2.14 2.782 3.465 1.914 1.708 3.525 2.24 4.023 2.491.498.25.789.208 1.08-.125.291-.333 1.246-1.458 1.579-1.958.333-.5.666-.417 1.122-.25.456.167 2.906 1.375 3.404 1.625.498.25.831.375.957.583.125.208.125 1.208-.262 2.302z" />
          </svg>
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="glass-card px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium">
            WhatsApp ile mesaj gönder
          </div>
        </div>
      </div>
    </a>
  );
}
