import React, { useState } from 'react'; // Keep only one React import
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '@/services/jobService';
import { deleteJob } from '@/services/jobMutationService'; // Correctly import deleteJob
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
} from "@/components/ui/alert-dialog";
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
import { Job } from '@/types/job';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

const AdminJobs: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const { data, isLoading, error, isError } = useQuery<{ jobs: Job[], total: number }, Error>({
    queryKey: ['adminJobs'],
    queryFn: () => fetchJobs({ limit: 1000 }), // Fetch all for now
  });

  // Mutation for deleting a job
  const deleteMutation = useMutation({
    mutationFn: deleteJob, // Use the imported deleteJob function
    // Correct onSuccess signature: receives result (boolean) and variables (id)
    onSuccess: (success, deletedId) => {
      if (success) {
        toast({ title: "Erfolgreich", description: `Job (ID: ${deletedId}) wurde gelöscht.` });
        queryClient.invalidateQueries({ queryKey: ['adminJobs'] }); // Refetch list
      }
      // Error toast is handled within deleteJob service function
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
    navigate('/admin/jobs/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/jobs/edit/${id}`);
  };

  const openDeleteDialog = (job: Job) => {
    setJobToDelete(job);
    setShowDeleteDialog(true);
  };

   const closeDeleteDialog = () => {
    setJobToDelete(null);
    setShowDeleteDialog(false);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteMutation.mutate(jobToDelete.id); // Pass the ID to mutate
    }
  };

  return (
    <> {/* Wrap everything in a Fragment */}
      <div> {/* Main content div */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jobs verwalten</h1>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Neuen Job hinzufügen
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-2">Lade Jobs...</p>
          </div>
        )}

        {isError && (
           <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
             <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
             <span className="font-medium">Fehler beim Laden der Jobs:</span> {error?.message || 'Unbekannter Fehler'}
           </div>
        )}

         {data && !isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Unternehmen</TableHead>
                <TableHead>Ort</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Veröffentlicht</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company_name || 'N/A'}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                     {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true, locale: de })}
                  </TableCell>
                  <TableCell>
                    {job.featured ? (
                      <Badge variant="default">Ja</Badge>
                    ) : (
                      <Badge variant="secondary">Nein</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(job.id)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Bearbeiten</span>
                    </Button>
                    <Button
                       variant="ghost"
                       size="icon"
                       className="text-red-600 hover:text-red-700"
                       onClick={() => openDeleteDialog(job)} // Open confirmation
                       disabled={deleteMutation.isPending && jobToDelete?.id === job.id}
                     >
                        {deleteMutation.isPending && jobToDelete?.id === job.id ? (
                         <Loader2 className="h-4 w-4 animate-spin" />
                       ) : (
                         <Trash2 className="h-4 w-4" />
                       )}
                       <span className="sr-only">Löschen</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {data.jobs.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={7} className="text-center text-muted-foreground">
                     Keine Jobs gefunden.
                   </TableCell>
                 </TableRow>
               )}
            </TableBody>
          </Table>
        )}
         {/* TODO: Add Pagination later */}
        </div>

        {/* Delete Confirmation Dialog for Jobs */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
              <AlertDialogDescription>
                Möchten Sie den Job "{jobToDelete?.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
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

export default AdminJobs;
