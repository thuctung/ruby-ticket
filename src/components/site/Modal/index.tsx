const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 z-1000">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-white p-6 shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold ">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1  transition hover:bg-slate-800 hover:text-white"
            aria-label="Đóng"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal;
const CloseIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
};
