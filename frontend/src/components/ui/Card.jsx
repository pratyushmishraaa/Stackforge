export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#13161e] border border-white/8 rounded-2xl ${onClick ? 'cursor-pointer hover:border-white/15 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
