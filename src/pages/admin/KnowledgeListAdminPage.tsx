import React, { useState, useEffect } from 'react'; // Import useEffect
import { useQuery } from '@tanstack/react-query';
import { fetchKnowledgePostsPaginated, KnowledgePostAdmin } from '@/services/knowledgeService'; // Import service and type
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input'; // Import Input
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import Table components
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state
import { ArrowUpDown } from 'lucide-react'; // Import icon for sorting

const PAGE_SIZE = 50; // Großzügige Paginierung

const KnowledgeListAdminPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('date_published'); // Default sort column
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // Default sort direction

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading, isError, error, isFetching, isPlaceholderData } = useQuery({
    // Include sort parameters in the queryKey
    queryKey: ['knowledgePostsAdmin', currentPage, PAGE_SIZE, debouncedSearchTerm, sortColumn, sortDirection],
    // Pass sort parameters to the query function (will require service update)
    queryFn: () => fetchKnowledgePostsPaginated(currentPage, PAGE_SIZE, debouncedSearchTerm, sortColumn, sortDirection),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Ensure query runs even if debouncedSearchTerm is initially empty
  });

  const posts = data?.posts ?? [];
  const totalPosts = data?.count ?? 0;
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (!isPlaceholderData && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // --- Sort Handler ---
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if sorting the same column
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };
  // --- End Sort Handler ---


  // Helper to render skeleton rows
  const renderSkeletonRows = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {/* Removed one skeleton cell */}
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      </TableRow>
    ));
  };


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Wissens-Beiträge</h1>
        {/* Optional: Add button to create new post */}
      </div>

       {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Nach Titel suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isError && (
        <p className="text-red-500 mb-4">Fehler beim Laden der Beiträge: {error?.message}</p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {/* Removed Interne ID, Renamed Original ID */}
            <TableHead>ID (WordPress)</TableHead> {/* Not sortable for now */}
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('title')}>
              <div className="flex items-center">
                Titel
                {sortColumn === 'title' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('date_published')}>
               <div className="flex items-center">
                Veröffentlicht
                {sortColumn === 'date_published' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </div>
            </TableHead>
            <TableHead>Vorschau</TableHead> {/* Not sortable */}
            <TableHead>Aktionen</TableHead> {/* Not sortable */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
             renderSkeletonRows(PAGE_SIZE) // Show skeletons while loading initial data
          ) : posts.length > 0 ? (
            posts.map((post: KnowledgePostAdmin) => (
              <TableRow key={post.id}>
                {/* Removed first ID cell, kept the second one */}
                <TableCell className="font-mono text-xs">{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.date_published ? new Date(post.date_published).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  {post.full_path ? (
                    <a href={`/wissen${post.full_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                      Anzeigen
                    </a>
                  ) : (
                    <span className="text-gray-400">Kein Pfad</span>
                  )}
                </TableCell>
                <TableCell>
                   <Link to={`/admin/knowledge/edit/${post.id}`}> {/* Link to edit page */}
                     <Button variant="outline" size="sm">Bearbeiten</Button>
                   </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* Adjusted colSpan */}
              <TableCell colSpan={5} className="text-center">Keine Beiträge gefunden.</TableCell>
            </TableRow>
          )}
          {/* Show skeleton rows during background fetching for pagination */}
          {isFetching && isPlaceholderData && renderSkeletonRows(PAGE_SIZE)}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">
          Seite {currentPage} von {totalPages} (Gesamt: {totalPosts} Beiträge)
        </span>
        <div className="flex gap-2">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isFetching}
            variant="outline"
            size="sm"
          >
            Zurück
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isPlaceholderData || isFetching}
            variant="outline"
            size="sm"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeListAdminPage;
