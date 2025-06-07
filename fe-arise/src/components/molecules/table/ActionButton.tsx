import { IconType } from "react-icons";

export default function ActionButton({
  children,
  onClick,
  title,
  ...rest
}: Readonly<{
  disabled?: boolean;
  title?: string;
  children?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: IconType;
}>) {
  return (
    <button
      title={title}
      disabled={rest.disabled}
      type="button"
      onClick={onClick}
      className="w-8 h-8 flex justify-center items-center opacity-60 hover:opacity-100 disabled:hover:opacity-60 disabled:text-slate-400 disabled:cursor-not-allowed"
    >
      {<rest.icon size={20} />}
      {children}
    </button>
  );
}