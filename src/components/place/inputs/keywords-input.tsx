"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Suggestions de mots-clés liés à la nourriture
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
]

interface KeywordsInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function KeywordsInput({ value, onChange }: KeywordsInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const addKeyword = (keyword: string) => {
    if (keyword && !value.includes(keyword)) {
      onChange([...value, keyword])
    }
    setInputValue("")
  }

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((k) => k !== keyword))
  }

  return (
    <div className="space-y-2">
      <Label>Mots-clés</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((keyword) => (
          <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
            {keyword}
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => removeKeyword(keyword)}>
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
              <CommandInput placeholder="Rechercher un mot-clé..." value={inputValue} onValueChange={setInputValue} />
              <CommandList>
                <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
                <CommandGroup>
                  {FOOD_KEYWORDS.filter(
                    (keyword) => !value.includes(keyword) && keyword.toLowerCase().includes(inputValue.toLowerCase()),
                  ).map((keyword) => (
                    <CommandItem
                      key={keyword}
                      onSelect={() => {
                        addKeyword(keyword)
                        setOpen(false)
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
                e.preventDefault()
                addKeyword(inputValue)
              }
            }}
          />
          <Button onClick={() => addKeyword(inputValue)} disabled={!inputValue}>
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  )
}

