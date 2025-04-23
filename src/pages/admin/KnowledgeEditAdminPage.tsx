import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchKnowledgePostById, updateKnowledgePost, KnowledgePostAdmin, KnowledgePostAdminUpdate } from '@/services/knowledgeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import react-hook-form
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { z } from 'zod'; // Import zod
import type { Json } from '@/integrations/supabase/types'; // Import Json type
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const KnowledgeEditAdminPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast(); // Initialize toast

  // Fetch the post data
  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['knowledgePostAdmin', postId],
    queryFn: () => fetchKnowledgePostById(postId!), // Add non-null assertion
    enabled: !!postId,
    refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
  });

  // --- Form Schema and Setup ---
  const formSchema = z.object({
    title: z.string().min(1, "Titel ist erforderlich"),
    slug: z.string().min(1, "Slug ist erforderlich"),
    content_rendered: z.string().optional().nullable(),
    excerpt_rendered: z.string().optional().nullable(),
    featured_media_url: z.string().url("Ungültige URL für Titelbild").optional().nullable(),
    date_published: z.string().datetime({ message: "Ungültiges Datumsformat (ISO 8601 erwartet)" }).optional().nullable(),
    // Für JSON-Felder: Vorerst als String validieren, da die UI eine Textarea verwendet.
    // Eine bessere Lösung wäre eine Komponente, die direkt JSON oder ein Array/Objekt liefert.
    category_terms: z.string().optional().nullable().refine(val => {
      if (!val) return true;
      try {
        JSON.parse(val);
        return true;
      } catch (e) {
        return false;
      }
    }, { message: "Ungültiges JSON-Format für Kategorien" }),
    tag_terms: z.string().optional().nullable().refine(val => {
        if (!val) return true;
        try {
          JSON.parse(val);
          return true;
        } catch (e) {
          return false;
        }
      }, { message: "Ungültiges JSON-Format für Schlagwörter" }),
  });

  // Type inferred from the Zod schema, used for form inputs (JSON as string)
  type FormInputData = z.infer<typeof formSchema>;


  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputData>({ // Use FormInputData directly
    resolver: zodResolver(formSchema),
    defaultValues: { // Pre-fill form with fetched data
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      content_rendered: post?.content_rendered ?? '',
      excerpt_rendered: post?.excerpt_rendered ?? '',
      featured_media_url: post?.featured_media_url ?? '',
      date_published: post?.date_published ?? '',
      // Konvertiere JSON zu String für die Textarea-Anzeige
      category_terms: post?.category_terms ? JSON.stringify(post.category_terms, null, 2) : '',
      tag_terms: post?.tag_terms ? JSON.stringify(post.tag_terms, null, 2) : '',
    }
  });

  // Reset form when post data changes (e.g., after initial load)
  React.useEffect(() => {
    if (post) {
      reset({
        title: post.title ?? '',
        slug: post.slug ?? '',
        content_rendered: post.content_rendered ?? '',
        excerpt_rendered: post.excerpt_rendered ?? '',
        featured_media_url: post.featured_media_url ?? '',
        date_published: post.date_published ?? '',
        // Konvertiere JSON zu String für die Textarea-Anzeige beim Reset
        category_terms: post.category_terms ? JSON.stringify(post.category_terms, null, 2) : '',
        tag_terms: post.tag_terms ? JSON.stringify(post.tag_terms, null, 2) : '',
      });
    }
  }, [post, reset]);
  // --- End Form Schema and Setup ---


  // --- Mutation for Updating ---
  const updateMutation = useMutation({
    mutationFn: (data: KnowledgePostAdminUpdate) => updateKnowledgePost(postId!, data),
    onSuccess: (updatedPost) => {
      toast({ title: "Erfolg", description: "Beitrag erfolgreich gespeichert." });
      // Invalidate queries to refetch list and potentially this post
      queryClient.invalidateQueries({ queryKey: ['knowledgePostsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgePostAdmin', postId] });
      // Optional: Navigate back to list after save
      // navigate('/admin/knowledge-list');
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast({
        title: "Fehler",
        description: `Beitrag konnte nicht gespeichert werden: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  // --- End Mutation ---


  if (isLoading) {
    // Skeleton loader for the form fields
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Skeleton className="h-8 w-32 mb-4" /> {/* Back button */}
        <Skeleton className="h-10 w-1/2 mb-6" /> {/* Page title */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" /> {/* Card title */}
            <Skeleton className="h-4 w-1/4" /> {/* Card description */}
          </CardHeader>
          <CardContent className="space-y-6 pt-4"> {/* Increased spacing */}
            {/* Skeleton for Title */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            {/* Skeleton for Slug */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            {/* Skeleton for Content */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-48 w-full" /> {/* Textarea */}
            </div>
             {/* Skeleton for Excerpt */}
             <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-24 w-full" /> {/* Textarea */}
            </div>
             {/* Skeleton for Featured Media URL */}
             <div className="space-y-2">
              <Skeleton className="h-4 w-32" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
             {/* Skeleton for Date Published */}
             <div className="space-y-2">
              <Skeleton className="h-4 w-48" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
             {/* Skeleton for Categories */}
             <div className="space-y-2">
              <Skeleton className="h-4 w-32" /> {/* Label */}
              <Skeleton className="h-24 w-full" /> {/* Textarea */}
            </div>
             {/* Skeleton for Tags */}
             <div className="space-y-2">
              <Skeleton className="h-4 w-32" /> {/* Label */}
              <Skeleton className="h-24 w-full" /> {/* Textarea */}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" /> {/* Save button */}
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isError) {
    return <div className="container mx-auto p-6 text-red-500">Fehler beim Laden des Beitrags: {error?.message}</div>;
  }

  if (!post) {
    return <div className="container mx-auto p-6">Beitrag nicht gefunden.</div>;
  }

  // --- Form Submit Handler ---
  const onSubmit: SubmitHandler<FormInputData> = (data) => {
    console.log("Submitting form input data:", data);
    // Konvertiere String-JSON zurück zu Objekten/Arrays vor dem Senden
    const updateData: KnowledgePostAdminUpdate = {
        ...data,
        category_terms: data.category_terms ? JSON.parse(data.category_terms) : null,
        tag_terms: data.tag_terms ? JSON.parse(data.tag_terms) : null,
        // Ensure date is null if empty string, otherwise keep the string
        date_published: data.date_published === '' ? null : data.date_published,
        featured_media_url: data.featured_media_url === '' ? null : data.featured_media_url,
        excerpt_rendered: data.excerpt_rendered === '' ? null : data.excerpt_rendered,
    };
    console.log("Parsed data for mutation:", updateData);
    updateMutation.mutate(updateData);
  };
  // --- End Form Submit Handler ---

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Button variant="outline" onClick={() => navigate('/admin/knowledge-list')} className="mb-4">
        &larr; Zurück zur Liste
      </Button>
      <h1 className="text-3xl font-bold mb-6">Wissensbeitrag bearbeiten</h1>

      {/* Use react-hook-form's handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            {/* Display title from form state for immediate feedback, fallback to post */}
            <CardTitle>{post?.title || 'Titel fehlt'}</CardTitle>
            <CardDescription>Original ID: {post.id} (Interne ID: {post.id})</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form fields using react-hook-form register */}
            <div className="space-y-1">
              <Label htmlFor="title">Titel</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Inhalt (HTML)</Label>
              {/* Consider using a Rich Text Editor / Markdown Editor component here */}
              <Textarea id="content" {...register("content_rendered")} rows={20} />
              {errors.content_rendered && <p className="text-sm text-red-600">{errors.content_rendered.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="excerpt">Auszug (HTML)</Label>
              <Textarea id="excerpt" {...register("excerpt_rendered")} rows={5} />
              {errors.excerpt_rendered && <p className="text-sm text-red-600">{errors.excerpt_rendered.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="featured_media_url">Titelbild URL</Label>
              <Input id="featured_media_url" type="url" {...register("featured_media_url")} />
              {/* Optional: Add image preview */}
              {post?.featured_media_url && <img src={post.featured_media_url} alt="Titelbild Vorschau" className="mt-2 max-h-40 w-auto" />}
              {errors.featured_media_url && <p className="text-sm text-red-600">{errors.featured_media_url.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="date_published">Veröffentlichungsdatum (ISO 8601)</Label>
              <Input id="date_published" type="text" {...register("date_published")} placeholder="YYYY-MM-DDTHH:mm:ss" />
              {errors.date_published && <p className="text-sm text-red-600">{errors.date_published.message}</p>}
            </div>
             <div className="space-y-1">
              <Label htmlFor="category_terms">Kategorien (JSON)</Label>
              <Textarea id="category_terms" {...register("category_terms")} rows={5} placeholder='[{"name": "Category 1", "slug": "category-1"}, ...]' />
              <p className="text-xs text-muted-foreground">Rohes JSON. Eine bessere UI (z.B. Multi-Select) wird empfohlen.</p>
              {errors.category_terms && <p className="text-sm text-red-600">{errors.category_terms.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="tag_terms">Schlagwörter (JSON)</Label>
              <Textarea id="tag_terms" {...register("tag_terms")} rows={5} placeholder='[{"name": "Tag 1", "slug": "tag-1"}, ...]' />
              <p className="text-xs text-muted-foreground">Rohes JSON. Eine bessere UI (z.B. Tag-Input) wird empfohlen.</p>
              {errors.tag_terms && <p className="text-sm text-red-600">{errors.tag_terms.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Speichere...' : 'Änderungen speichern'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default KnowledgeEditAdminPage;
