import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Define the structure of a single breadcrumb item based on Yoast data
interface BreadcrumbItem {
  name: string;
  item?: string; // URL, optional for the last item
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[] | null | undefined;
}

// Helper function to convert absolute Yoast URLs to relative paths
const getRelativePath = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const urlObject = new URL(url);
    // Assuming knowledge paths start with /wissen/
    if (urlObject.pathname.startsWith('/wissen/')) {
      return urlObject.pathname;
    }
    // Add more specific checks if needed for other sections
    // Fallback for potentially different structures (e.g., only slug)
    if (!urlObject.pathname.startsWith('/')) {
        // Check if it looks like a category slug
        if (!url.includes('/') && url.length > 0) {
             return `/wissen/kategorie/${url}`; // Assume it's a category slug
        }
    }
    // If it doesn't match known patterns, return null or the original path
    return urlObject.pathname; 
  } catch (e) {
    // Handle cases where 'item' might not be a full URL (e.g., just a slug)
     if (typeof url === 'string' && !url.includes('/') && url.length > 0) {
        return `/wissen/kategorie/${url}`; // Assume it's a category slug
     }
    console.warn("Could not parse breadcrumb URL:", url, e);
    return null; // Cannot determine relative path
  }
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  // Filter out potential invalid items (e.g., null or missing name)
  const validItems = items.filter(item => item && item.name);

  // If the first valid item is "Wissen", we don't need the static one.
  // Also handle the case where validItems might be empty but items is not (though unlikely with current filter)
  const showStaticWissenLink = validItems.length === 0 || validItems[0]?.name?.toLowerCase() !== 'wissen';

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 py-3 border-b border-gray-200"> {/* Increased padding */}
      <div className="container mx-auto max-w-6xl px-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600"> {/* Increased font size and spacing */}
          {/* Conditionally render static "Wissen" link */}
          {showStaticWissenLink && (
            <li>
              <Link to="/wissen" className="hover:text-kita-blue hover:underline">
                Wissen
              </Link>
            </li>
          )}
          {validItems.map((item, index) => {
            const relativePath = getRelativePath(item.item);
            // Determine if this item should be preceded by a separator
            // Show separator if it's not the very first item displayed
            // (considering the conditional static link and index)
            const needsSeparator = index > 0 || (index === 0 && !showStaticWissenLink);
            const isLast = index === validItems.length - 1;


            return (
              <li key={index} className="flex items-center">
                {needsSeparator && <ChevronRight size={16} className="text-gray-400 mx-1.5" />} {/* Increased size/margin */}
                {isLast || !relativePath ? (
                  // Last item or item without a valid link
                  <span className="font-medium text-gray-800" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  // Item with a link
                  <Link
                    to={relativePath}
                    className="hover:text-kita-blue hover:underline"
                  >
                    {item.name} {/* Ensure HTML entities are decoded if necessary, though likely handled by DB/source */}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
