import React, { useState } from 'react'; // Import useState
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation, useQueryClient
import { useNavigate } from 'react-router-dom';
import { fetchCompanies } from '@/services/company/companyListService';
import { deleteCompany } from '@/services/company/companyMutationService'; // Import deleteCompany
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Company } from '@/types/company';
import { toast } from '@/components/ui/use-toast'; // Import toast

const AdminKitas: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get query client
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [kitaToDelete, setKitaToDelete] = useState<Company | null>(null);

  const { data, isLoading, error, isError } = useQuery<{ companies: Company[], total: number }, Error>({
    queryKey: ['adminCompanies'],
    queryFn: () => fetchCompanies({ limit: 1000 }), // Fetch all for now
  });

  // Mutation for deleting a company
  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: (success, id) => {
      if (success) {
        toast({ title: "Erfolgreich", description: `Kita wurde gelöscht.` });
        queryClient.invalidateQueries({ queryKey: ['adminCompanies'] }); // Refetch list
      }
      // Error toast is handled within deleteCompany service function
    },
    onError: (error) => {
       // Fallback error toast if mutation itself fails unexpectedly
       toast({ title: "Fehler", description: `Löschen fehlgeschlagen: ${error.message}`, variant: "destructive" });
    },
     onSettled: () => {
       closeDeleteDialog(); // Close dialog regardless of outcome
     }
  });

  const handleAddNew = () => {
    navigate('/admin/kitas/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/kitas/edit/${id}`);
  };

  const openDeleteDialog = (kita: Company) => {
    setKitaToDelete(kita);
    setShowDeleteDialog(true);
  };

   const closeDeleteDialog = () => {
    setKitaToDelete(null);
    setShowDeleteDialog(false);
  };

  const confirmDelete = () => {
    if (kitaToDelete) {
      deleteMutation.mutate(kitaToDelete.id);
    }
  };

  return (
    <> {/* Use Fragment to wrap multiple root elements */}
      <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kitas / Unternehmen verwalten</h1>
        <Button onClick={handleAddNew}> {/* Add onClick handler */}
          <PlusCircle className="mr-2 h-4 w-4" /> Neue Kita hinzufügen
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-2">Lade Kitas...</p>
        </div>
      )}

      {isError && (
         <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
           <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
           <span className="font-medium">Fehler beim Laden der Kitas:</span> {error?.message || 'Unbekannter Fehler'}
         </div>
      )}

      {data && !isLoading && !isError && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stadt</TableHead>
              <TableHead>Bundesland</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.companies.map((kita) => (
              <TableRow key={kita.id}>
                <TableCell className="font-medium">{kita.name}</TableCell>
                <TableCell>{kita.city || kita.location || 'N/A'}</TableCell> {/* Fallback for city */}
                <TableCell>{kita.bundesland || 'N/A'}</TableCell>
                <TableCell>
                  {kita.is_premium ? (
                    <Badge variant="default">Ja</Badge>
                  ) : (
                    <Badge variant="secondary">Nein</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(kita.id)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Bearbeiten</span>
                  </Button>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="text-red-600 hover:text-red-700"
                     onClick={() => openDeleteDialog(kita)} // Open confirmation dialog
                     disabled={deleteMutation.isPending && kitaToDelete?.id === kita.id} // Disable while deleting this specific item
                   >
                     {deleteMutation.isPending && kitaToDelete?.id === kita.id ? (
                       <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                       <Trash2 className="h-4 w-4" />
                     )}
                     <span className="sr-only">Löschen</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {data.companies.length === 0 && (
               <TableRow>
                 <TableCell colSpan={5} className="text-center text-muted-foreground">
                   Keine Kitas gefunden.
                 </TableCell>
               </TableRow>
             )}
          </TableBody>
        </Table>
      )}
       {/* TODO: Add Pagination later */}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie die Kita "{kitaToDelete?.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden. Zugehörige Bilder im Storage werden NICHT automatisch gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog} disabled={deleteMutation.isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminKitas;
