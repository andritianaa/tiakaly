"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Catégories de mots-clés
const KEYWORD_CATEGORIES = {
  cuisine: {
    name: "Type de cuisine",
    keywords: [
      "Malgache",
      "Française",
      "Italienne",
      "Asiatique",
      "Indienne",
      "Fusion",
      "Vegan / Végétarienne",
      "Fruits de mer",
      "Grillades",
      "Street food",
      "Healthy",
      "Pâtisserie",
    ],
    isCheckList: false,
  },
  occasion: {
    name: "Moment du repas / Occasion",
    keywords: [
      "Petit-déjeuner",
      "Brunch",
      "Déjeuner",
      "Dîner",
      "Goûter",
      "Apéro",
      "Dessert",
      "Pause café",
      "Date / Rendez-vous amoureux",
      "Fête d'anniversaire",
      "Célébration",
    ],
    isCheckList: false,
  },
  ambiance: {
    name: "Ambiance / Décor",
    keywords: [
      "Conviviale / Familiale",
      "Élégante / Chic",
      "Moderne / Tendance",
      "Rustique / Traditionnelle",
      "Nature / Jardin / Terrasse",
      "Vue panoramique / Rooftop",
    ],
    isCheckList: false,
  },
  location: {
    name: "Localisation",
    keywords: [
      "En ligne",
      "Antananarivo",
      "Analakely",
      "Ivandry",
      "Ambatobe",
      "Ankorondrano",
      "Ambatomena",
      "Bord du lac",
      "Centre-ville",
      "Proche de l'aéroport",
    ],
    isCheckList: false,
  },
};

// Suggestions de mots-clés généraux (conservés de l'original)
const FOOD_KEYWORDS = [
  "italien",
  "français",
  "japonais",
  "chinois",
  "indien",
  "thaïlandais",
  "mexicain",
  "américain",
  "libanais",
  "grec",
  "espagnol",
  "coréen",
  "vietnamien",
  "fusion",
  "végétarien",
  "vegan",
  "sans gluten",
  "bio",
  "local",
  "fruits de mer",
  "poisson",
  "viande",
  "barbecue",
  "grill",
  "pizza",
  "pâtes",
  "sushi",
  "burger",
  "sandwich",
  "salade",
  "soupe",
  "dessert",
  "pâtisserie",
  "café",
  "brunch",
  "petit-déjeuner",
  "déjeuner",
  "dîner",
  "street food",
  "gastronomique",
  "bistro",
  "brasserie",
  "épicé",
  "sucré",
  "salé",
  "amer",
  "umami",
  "frais",
  "fait maison",
  "traditionnel",
  "moderne",
  "fusion",
  "exotique",
  "familial",
  "romantique",
  "vue",
  "terrasse",
];

interface KeywordsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function KeywordsInput({ value, onChange }: KeywordsInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // État local pour les catégories
  const [categorizedKeywords, setCategorizedKeywords] = useState<
    Record<string, string[]>
  >({
    cuisine: [],
    occasion: [],
    ambiance: [],
    location: [],
  });

  // Synchroniser les catégories avec la liste de valeurs lorsque value change
  useEffect(() => {
    // Initialiser les catégories en fonction des mots-clés existants
    const initialCategories: Record<string, string[]> = {
      cuisine: [],
      occasion: [],
      ambiance: [],
      location: [],
    };

    // Pour chaque mot-clé, vérifier s'il appartient à une catégorie
    value.forEach((keyword) => {
      Object.entries(KEYWORD_CATEGORIES).forEach(([categoryKey, category]) => {
        if (
          category.keywords.includes(keyword) &&
          !initialCategories[categoryKey].includes(keyword)
        ) {
          initialCategories[categoryKey].push(keyword);
        }
      });
    });

    setCategorizedKeywords(initialCategories);
  }, []);

  // Ajouter un mot-clé général
  const addKeyword = (keyword: string) => {
    if (keyword && !value.includes(keyword)) {
      onChange([...value, keyword]);
    }
    setInputValue("");
  };

  // Supprimer un mot-clé général
  const removeKeyword = (keyword: string) => {
    onChange(value.filter((k) => k !== keyword));

    // Supprimer également de toutes les catégories
    const updatedCategories = { ...categorizedKeywords };
    Object.keys(updatedCategories).forEach((category) => {
      updatedCategories[category] = updatedCategories[category].filter(
        (k) => k !== keyword
      );
    });
    setCategorizedKeywords(updatedCategories);
  };

  // Ajouter un mot-clé à une catégorie spécifique
  const addCategoryKeyword = (category: string, keyword: string) => {
    if (!categorizedKeywords[category].includes(keyword)) {
      // Mettre à jour la catégorie
      const updatedCategories = {
        ...categorizedKeywords,
        [category]: [...categorizedKeywords[category], keyword],
      };
      setCategorizedKeywords(updatedCategories);

      // Ajouter à la liste générale si pas déjà présent
      if (!value.includes(keyword)) {
        onChange([...value, keyword]);
      }
    }
  };

  // Supprimer un mot-clé d'une catégorie spécifique
  const removeCategoryKeyword = (category: string, keyword: string) => {
    const updatedCategories = {
      ...categorizedKeywords,
      [category]: categorizedKeywords[category].filter((k) => k !== keyword),
    };
    setCategorizedKeywords(updatedCategories);

    // On ne supprime pas automatiquement de la liste générale
    // car le mot-clé pourrait être utilisé dans d'autres catégories
  };

  // Gérer les changements de checkbox pour les catégories de type checklist
  const handleCheckboxChange = (
    category: string,
    keyword: string,
    checked: boolean
  ) => {
    if (checked) {
      addCategoryKeyword(category, keyword);
    } else {
      removeCategoryKeyword(category, keyword);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="cuisine">Cuisine</TabsTrigger>
          <TabsTrigger value="occasion">Occasion</TabsTrigger>
          <TabsTrigger value="ambiance">Ambiance</TabsTrigger>
          <TabsTrigger value="location">Localisation</TabsTrigger>
        </TabsList>

        {/* Onglet Général - Système existant */}
        <TabsContent value="general" className="mt-4">
          <div className="space-y-2">
            <Label>Tous les mots-clés</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {value.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {keyword}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => removeKeyword(keyword)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un mot-clé
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher un mot-clé..."
                      value={inputValue}
                      onValueChange={setInputValue}
                    />
                    <CommandList>
                      <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
                      <CommandGroup>
                        {FOOD_KEYWORDS.filter(
                          (keyword) =>
                            !value.includes(keyword) &&
                            keyword
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                        ).map((keyword) => (
                          <CommandItem
                            key={keyword}
                            onSelect={() => {
                              addKeyword(keyword);
                              setOpen(false);
                            }}
                          >
                            {keyword}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Ou saisir un nouveau mot-clé"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword(inputValue);
                    }
                  }}
                />
                <Button
                  onClick={() => addKeyword(inputValue)}
                  disabled={!inputValue}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Onglets pour chaque catégorie */}
        {Object.entries(KEYWORD_CATEGORIES).map(([categoryKey, category]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>{category.name}</Label>

                  {/* Affichage des mots-clés sélectionnés dans cette catégorie */}
                  {!category.isCheckList && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categorizedKeywords[categoryKey]?.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {keyword}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() =>
                              removeCategoryKeyword(categoryKey, keyword)
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Liste de sélection pour les catégories normales */}
                  {!category.isCheckList && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.keywords.map((keyword) => (
                        <Button
                          key={keyword}
                          variant={
                            categorizedKeywords[categoryKey]?.includes(keyword)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            if (
                              categorizedKeywords[categoryKey]?.includes(
                                keyword
                              )
                            ) {
                              removeCategoryKeyword(categoryKey, keyword);
                            } else {
                              addCategoryKeyword(categoryKey, keyword);
                            }
                          }}
                        >
                          {keyword}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Checklist pour les catégories de type checklist */}
                  {category.isCheckList && (
                    <div className="space-y-2">
                      {category.keywords.map((keyword) => (
                        <div
                          key={keyword}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${categoryKey}-${keyword}`}
                            checked={categorizedKeywords[categoryKey]?.includes(
                              keyword
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                categoryKey,
                                keyword,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`${categoryKey}-${keyword}`}
                            className="cursor-pointer"
                          >
                            {keyword}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Résumé des catégories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(KEYWORD_CATEGORIES).map(([categoryKey, category]) => (
            <div key={categoryKey} className="space-y-1">
              <h4 className="text-sm font-medium">{category.name}</h4>
              <div className="flex flex-wrap gap-1">
                {categorizedKeywords[categoryKey]?.length > 0 ? (
                  categorizedKeywords[categoryKey].map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Aucune sélection
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
