import { MessageCircle } from "lucide-react";

export function BannerVIP() {
  return (
    <div className="bg-[var(--color-primary)] text-white p-3 text-center text-sm sm:text-base font-bold flex items-center justify-center gap-2 relative z-50 shadow-md cursor-pointer hover:bg-[var(--color-primary-deep)] transition-colors">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <span>Quer receber ofertas antes de todo mundo? Entre no VIP!</span>
        </div>
        <span className="text-[10px] font-normal opacity-90 mt-0.5 tracking-wide">
          🔥 Junte-se a +800 pessoas economizando hoje
        </span>
      </div>
    </div>
  );
}
