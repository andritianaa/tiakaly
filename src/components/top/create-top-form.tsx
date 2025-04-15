"use client";

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createTop, updateTop } from '@/actions/top.actions';
import { MainMediaInput } from '@/components/place/inputs/main-media-input';
import { PostFbDialog, PostInstaDialog } from '@/components/post-insta/post-insta-dialog';
import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis.",
  }),
  description: z.string().min(1, {
    message: "La description est requise.",
  }),
  top1Id: z.string().min(1, {
    message: "Le post numéro 1 est requis.",
  }),
  top1Reason: z.string().min(1, {
    message: "La raison pour le Top 1 est requise.",
  }),
  top2Id: z.string().optional(),
  top2Reason: z.string().min(1, {
    message: "La raison pour le Top 2 est requise.",
  }),
  top3Id: z.string().optional(),
  top3Reason: z.string().optional(),
  mainMediaId: z.string().min(1, {
    message: "L'image principale est requise.",
  }),
});

type PostInsta = {
  id: string;
  title: string;
  url: string;
  date: string;
};

interface CreateTopFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    top1Id: string;
    top1Reason: string;
    top2Id?: string | null;
    top2Reason: string;
    top3Id?: string | null;
    top3Reason: string;
    mainMediaId: string;
    mainMedia?: {
      id: string;
      url: string;
    };
    top1?: PostInsta;
    top2?: PostInsta;
    top3?: PostInsta;
  };
}

export function CreateTopForm({ initialData }: CreateTopFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostInsta[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData?.id;
  const [mainMediaId, setMainMediaId] = useState(
    initialData?.mainMediaId || ""
  );

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      top1Id: initialData?.top1Id || "",
      top1Reason: initialData?.top1Reason || "",
      top2Id: initialData?.top2Id || "",
      top2Reason: initialData?.top2Reason || "",
      top3Id: initialData?.top3Id || "",
      top3Reason: initialData?.top3Reason || "",
      mainMediaId: initialData?.mainMediaId || "",
    },
  });

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts function
  const fetchPosts = async (query = "") => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch(
        `/api/post-insta/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (isEditMode) {
        // Make sure the initial posts are included in the list
        const initialPosts = [
          initialData?.top1,
          initialData?.top2,
          initialData?.top3,
        ].filter(Boolean) as PostInsta[];

        // Create a map of existing post IDs to avoid duplicates
        const postMap = new Map<string, PostInsta>();

        // Add fetched posts to the map
        data.forEach((post: PostInsta) => {
          postMap.set(post.id, post);
        });

        // Add initial posts if they're not already in the list
        initialPosts.forEach((post) => {
          if (post && !postMap.has(post.id)) {
            postMap.set(post.id, post);
          }
        });

        // Convert map values to array and ensure they match PostInsta type
        const postsArray = Array.from(postMap.values()).map((post) => ({
          id: post.id,
          title: post.title,
          url: post.url,
          date: post.date.toString(),
        }));

        setPosts(postsArray);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast({
        description:
          "Échec du chargement des posts Instagram. Veuillez réessayer.",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Search posts function
  const searchPosts = async (query: string) => {
    if (query.length < 2 && query.length > 0) return;
    fetchPosts(query);
  };

  // Handle new post creation
  const handlePostCreated = (post: PostInsta) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
    toast({
      description:
        "Nouveau post Instagram ajouté et disponible pour la sélection",
      variant: "success",
      duration: 3000,
    });
  };

  // Handle main media change
  const handleMainMediaChange = (mediaId: string) => {
    setMainMediaId(mediaId);
    form.setValue("mainMediaId", mediaId);
    form.clearErrors("mainMediaId");
  };

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Make sure mainMediaId is included
    values.mainMediaId = mainMediaId;

    if (!values.mainMediaId) {
      form.setError("mainMediaId", {
        type: "manual",
        message: "Une image principale est requise.",
      });
      toast({
        description: "Veuillez sélectionner une image principale.",
        variant: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && initialData?.id) {
        // Update existing top
        result = await updateTop(initialData.id, values);
        if (result.error) {
          throw new Error(result.error);
        }

        toast({
          description: "Top liste mise à jour avec succès !",
          variant: "success",
          duration: 3000,
        });
      } else {
        // Create new top
        result = await createTop(values);
        if (result.error) {
          throw new Error(result.error);
        }

        toast({
          description: "Top liste créée avec succès !",
          variant: "success",
          duration: 3000,
        });
      }

      router.push("/admin/top");
      router.refresh();
    } catch (error) {
      console.error(
        `Erreur lors de la ${isEditMode ? "mise à jour" : "création"} du top:`,
        error
      );
      toast({
        description: `Échec de la ${
          isEditMode ? "mise à jour" : "création"
        } de la Top liste. Veuillez réessayer.`,
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez un titre pour cette liste Top"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Un titre descriptif pour votre liste Top.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Entrez une description pour cette liste Top"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Décrivez ce que cette liste Top représente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mainMediaId"
            render={() => (
              <FormItem>
                <FormLabel>Image Principale</FormLabel>
                <MainMediaInput
                  value={mainMediaId}
                  onChange={handleMainMediaChange}
                  mediaUrl={initialData?.mainMedia?.url}
                />
                <FormDescription>
                  Sélectionnez une image principale pour cette liste Top.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Posts</h3>
          <div className="flex gap-2">
            <PostInstaDialog onPostCreated={handlePostCreated} />
            <PostFbDialog onPostCreated={handlePostCreated} />
          </div>
        </div>

        <div className="space-y-8">
          {/* Top 1 */}
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Top 1</h4>
            <FormField
              control={form.control}
              name="top1Id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Post Instagram</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? posts.find((post) => post.id === field.value)
                                ?.title || "Sélectionner un post..."
                            : "Sélectionner un post..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher sur Instagram..."
                          onValueChange={searchPosts}
                        />
                        {isLoadingPosts && (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <CommandList>
                          <CommandEmpty>Aucun post trouvé.</CommandEmpty>
                          <CommandGroup>
                            {posts.map((post) => (
                              <CommandItem
                                key={post.id}
                                value={post.id}
                                onSelect={() => {
                                  form.setValue("top1Id", post.id);
                                }}
                                disabled={
                                  form.watch("top2Id") === post.id ||
                                  form.watch("top3Id") === post.id
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    post.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{post.title}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                    {post.url}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="top1Reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raison</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Pourquoi ce post est-il numéro 1 ?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Top 2 */}
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Top 2</h4>
            <FormField
              control={form.control}
              name="top2Id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Post Instagram (Optionnel)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? posts.find((post) => post.id === field.value)
                                ?.title || "Sélectionner un post..."
                            : "Sélectionner un post..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher sur Instagram..."
                          onValueChange={searchPosts}
                        />
                        {isLoadingPosts && (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <CommandList>
                          <CommandEmpty>Aucun post trouvé.</CommandEmpty>
                          <CommandGroup>
                            {posts.map((post) => (
                              <CommandItem
                                key={post.id}
                                value={post.id}
                                onSelect={() => {
                                  form.setValue("top2Id", post.id);
                                }}
                                disabled={
                                  form.watch("top1Id") === post.id ||
                                  form.watch("top3Id") === post.id
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    post.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{post.title}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                    {post.url}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="top2Reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raison</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Pourquoi ce post est-il numéro 2 ?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Top 3 */}
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Top 3</h4>
            <FormField
              control={form.control}
              name="top3Id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Post Instagram (Optionnel)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? posts.find((post) => post.id === field.value)
                                ?.title || "Sélectionner un post..."
                            : "Sélectionner un post..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher sur Instagram..."
                          onValueChange={searchPosts}
                        />
                        {isLoadingPosts && (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <CommandList>
                          <CommandEmpty>Aucun post trouvé.</CommandEmpty>
                          <CommandGroup>
                            {posts.map((post) => (
                              <CommandItem
                                key={post.id}
                                value={post.id}
                                onSelect={() => {
                                  form.setValue("top3Id", post.id);
                                }}
                                disabled={
                                  form.watch("top1Id") === post.id ||
                                  form.watch("top2Id") === post.id
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    post.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{post.title}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                    {post.url}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="top3Reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raison</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Pourquoi ce post est-il numéro 3 ?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? "Mettre à jour la liste Top" : "Créer une liste Top"}
        </Button>
      </form>
    </Form>
  );
}
