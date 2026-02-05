import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-100 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900",
        className
      )}
    >
      {children}
    </div>
  );
};