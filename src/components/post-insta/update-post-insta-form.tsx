/* eslint-disable @next/next/no-img-element */
"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InstagramEmbed } from "react-social-media-embed";
import { z } from "zod";

import { checkUrlExists, updatePostInsta } from "@/actions/post-insta.actions";
import { MainMediaInput } from "@/components/place/inputs/main-media-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema with Zod
const formSchema = z.object({
  date: z.date({
    required_error: "Une date est requise.",
  }),
  url: z.string().url({
    message: "Veuillez entrer une URL valide.",
  }),
  title: z.string().min(1, {
    message: "Le titre est requis.",
  }),
  placeId: z.string().optional(),
  mainMediaId: z.string().min(1, {
    message: "Une image principale est requise.",
  }),
});

export type PostInstaFormValues = z.infer<typeof formSchema>;

type Place = {
  id: string;
  title: string;
  localisation: string;
  mainMedia?: {
    url: string;
  };
};

interface UpdatePostInstaFormProps {
  id: string;
  initialData: {
    date: Date;
    url: string;
    title: string;
    placeId?: string;
    mainMediaId: string;
    mainMedia?: {
      id: string;
      url: string;
    };
    place?: {
      id: string;
      title: string;
      localisation: string;
    };
  };
  onSuccess?: (data: any) => void;
}

export function UpdatePostInstaForm({
  id,
  initialData,
  onSuccess,
}: UpdatePostInstaFormProps) {
  const { toast } = useToast();
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validUrl, setValidUrl] = useState(initialData.url || "");
  const [mainMediaId, setMainMediaId] = useState(initialData.mainMediaId || "");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize the form with initial data
  const form = useForm<PostInstaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialData.date ? new Date(initialData.date) : new Date(),
      url: initialData.url || "",
      title: initialData.title || "",
      placeId: initialData.placeId,
      mainMediaId: initialData.mainMediaId || "",
    },
  });

  // Fetch all places on component mount
  useEffect(() => {
    fetchAllPlaces();
  }, []);

  // Fetch all places
  const fetchAllPlaces = async () => {
    setIsLoadingPlaces(true);
    try {
      const response = await fetch("/api/places/all");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des lieux");
      }
      const data = await response.json();
      setAllPlaces(data);
      // Initially show first 5 places
      setFilteredPlaces(data.slice(0, 5));
    } catch (error) {
      console.error("Erreur lors de la récupération des lieux:", error);
      toast({
        description: "Échec de la récupération des lieux. Veuillez réessayer.",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // Filter places based on search query
  const filterPlaces = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // If no query, show first 5 places
      setFilteredPlaces(allPlaces.slice(0, 5));
      return;
    }

    // Filter places based on title or localisation
    const filtered = allPlaces.filter(
      (place) =>
        place.title.toLowerCase().includes(query.toLowerCase()) ||
        place.localisation.toLowerCase().includes(query.toLowerCase())
    );

    // Limit to 5 results
    setFilteredPlaces(filtered.slice(0, 5));
  };

  // Update form when mainMediaId changes
  const handleMainMediaChange = (mediaId: string) => {
    setMainMediaId(mediaId);
    form.setValue("mainMediaId", mediaId);
    form.clearErrors("mainMediaId");
  };

  // Form submission handler
  async function onSubmit(values: PostInstaFormValues) {
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
      // Only check URL if it has changed from the initial value
      if (values.url !== initialData.url) {
        // Check if URL already exists
        const urlExists = await checkUrlExists(values.url);
        if (urlExists) {
          form.setError("url", {
            type: "manual",
            message: "Cette URL Instagram existe déjà dans la base de données",
          });
          toast({
            description: "Cette URL Instagram existe déjà",
            variant: "error",
            duration: 3000,
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Update post
      const result = await updatePostInsta(id, values);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        description: "Post Instagram mis à jour avec succès !",
        variant: "success",
        duration: 3000,
      });

      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        description:
          "Échec de la mise à jour du post Instagram. Veuillez réessayer.",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUrlChange = (url: string) => {
    form.setValue("url", url);

    // Basic Instagram URL validation
    const isInstagramUrl = /instagram\.com\/p\/[A-Za-z0-9_-]+/.test(url);
    if (isInstagramUrl) {
      setValidUrl(url);
    } else {
      setValidUrl("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                La date de publication du post Instagram.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Instagram</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.instagram.com/p/..."
                  {...field}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>{`L'URL du post Instagram. Doit être unique.`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {validUrl && (
          <div className="mt-4">
            <InstagramEmbed
              url={validUrl}
              className="w-full max-w-xl max-md:p-2"
              igVersion=""
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Entrez un titre pour ce post" {...field} />
              </FormControl>
              <FormDescription>
                Un titre descriptif pour le post Instagram.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Lieu (Optionnel)</FormLabel>
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
                        ? allPlaces.find((place) => place.id === field.value)
                            ?.title ||
                          initialData.place?.title ||
                          "Sélectionner un lieu..."
                        : "Sélectionner un lieu..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher un lieu..."
                      value={searchQuery}
                      onValueChange={filterPlaces}
                    />
                    {isLoadingPlaces && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    <CommandList>
                      <CommandEmpty>Aucun lieu trouvé.</CommandEmpty>
                      <CommandGroup>
                        {filteredPlaces.map((place) => (
                          <CommandItem
                            key={place.id}
                            value={place.id}
                            onSelect={() => {
                              form.setValue("placeId", place.id);
                            }}
                          >
                            <div className="flex items-center gap-2 w-full">
                              {place.mainMedia?.url && (
                                <div className="h-8 w-8 rounded-md overflow-hidden flex-shrink-0">
                                  <img
                                    src={
                                      place.mainMedia.url || "/placeholder.svg"
                                    }
                                    alt={place.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="truncate font-medium">
                                  {place.title}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {place.localisation}
                                </span>
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  place.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Sélectionnez un lieu associé à ce post Instagram.
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
              <MainMediaInput
                value={mainMediaId}
                onChange={handleMainMediaChange}
                mediaUrl={initialData.mainMedia?.url}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mettre à jour le Post Instagram
        </Button>
      </form>
    </Form>
  );
}
