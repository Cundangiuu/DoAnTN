type CardProps = {
  title: string;
  translate: string;
  description: string;
};

export default function InvoiceCard({
  title,
  translate,
  description,
}: Readonly<CardProps>) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-500">{title}</h2>
      <h3 className="text-sm text-gray-500 mt-1">({translate})</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{description}</p>
    </div>
  );
}
