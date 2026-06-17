import { MessageCircle } from "lucide-react";

export function BannerVIP() {
  return (
    <div className="bg-green-600 text-white p-3 text-center text-sm sm:text-base font-bold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md cursor-pointer hover:bg-green-700 transition-colors">
      <MessageCircle size={20} />
      <span>Quer receber ofertas antes de todo mundo? Entre no VIP!</span>
    </div>
  );
}
