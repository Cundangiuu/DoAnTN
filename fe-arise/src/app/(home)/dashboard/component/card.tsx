import Link from "next/link";

type CardProps = {
  title: string;
  description: string;
  url: string;
};

export default function Card({ title, description, url }: Readonly<CardProps>) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="bg-red-100 text-red-600 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 19.121a3 3 0 104.243 4.243M15.75 6.75a6.75 6.75 0 100-13.5m.007 5.25h-.007m3.129-1.936a8.125 8.125 0 101.519-7.744"
            />
          </svg>
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className="mt-auto flex items-center justify-between">
        <Link
          className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded hover:bg-red-300"
          href={`${url}`}
        >
          {title}
        </Link>
      </div>
    </div>
  );
}
