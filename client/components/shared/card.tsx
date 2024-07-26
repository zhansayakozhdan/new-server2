import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  _id: string;
  title: string;
  location: string;
  thumbnail: string;
  url: string;
  prize: string;
}

const MyCard: React.FC<CardProps> = ({ _id, title, location, thumbnail, url, prize }) => {
  // Ensure the thumbnail URL starts with http:// or https://
  const absoluteThumbnailUrl = thumbnail.startsWith('//') ? `https:${thumbnail}` : thumbnail;

  const extractCurrencyValue = (htmlString: string): number => {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const span = div.querySelector('span[data-currency-value]');
    if (span) {
      const value = span.textContent || '0';
      return parseFloat(value.replace(/,/g, ''));
    }
    return 0;
  };

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <Image src={absoluteThumbnailUrl} alt={title} width={300} height={200} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-sm text-gray-700">Prize: ${extractCurrencyValue(prize)}</p>
        <Link href={`events/${_id}`} passHref legacyBehavior>
          <a className="text-primary-500 hover:text-primary-700">Learn more</a>
        </Link>
      </div>
    </div>
  );
};

export default MyCard;
