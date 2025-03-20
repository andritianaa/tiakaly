"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { createMenu } from "@/actions/place-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetcher } from "@/lib/utils";
import { Menu } from "@prisma/client";

import type { MenuInput as MenuInputType } from "@/types/place";
interface MenuInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function MenuInput({ value, onChange }: MenuInputProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [newMenuName, setNewMenuName] = useState("");
  const [availableMenus, setAvailableMenus] = useState<MenuInputType[]>([]);

  const { data: menu, mutate } = useSWR<Menu[]>("/api/places/menu", fetcher);

  // Simuler le chargement des menus disponibles
  useEffect(() => {
    // Dans une application réelle, cela serait un appel API
    const fetchMenus = async () => {
      // Simulation de données
      if (menu) {
        setAvailableMenus(menu);
      } else {
        const menus: MenuInputType[] = [
          { id: "Menu du jour", name: "Menu du jour" },
          { id: "Menu dégustation", name: "Menu dégustation" },
          { id: "Menu enfant", name: "Menu enfant" },
          { id: "Menu végétarien", name: "Menu végétarien" },
          { id: "Menu spécial", name: "Menu spécial" },
        ];
        setAvailableMenus(menus);
      }
    };

    fetchMenus();
  }, [menu]);

  const addMenu = (menuId: string) => {
    if (!value.includes(menuId)) {
      onChange([...value, menuId]);
    }
  };

  const removeMenu = (menuId: string) => {
    onChange(value.filter((id) => id !== menuId));
  };

  // Simuler l'ajout d'un nouveau menu
  const createNewMenu = async () => {
    if (newMenuName.trim()) {
      const res = await createMenu(newMenuName.trim());
      const newId = res!.id;
      const newMenu: MenuInputType = { id: newId, name: newMenuName };

      // Ajouter à la liste des menus disponibles
      setAvailableMenus([...availableMenus, newMenu]);

      // Sélectionner le nouveau menu
      addMenu(newId);

      // Réinitialiser et fermer
      setNewMenuName("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Menus</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((menuId) => {
          const menu = availableMenus.find((m) => m.id === menuId);
          return (
            <Badge
              key={menuId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {menu ? menu.name : menuId}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeMenu(menuId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un menu
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Rechercher un menu..."
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandList>
                <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
                <CommandGroup>
                  {availableMenus
                    .filter(
                      (menu) =>
                        !value.includes(menu.id) &&
                        menu.name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    )
                    .map((menu) => (
                      <CommandItem
                        key={menu.id}
                        onSelect={() => {
                          addMenu(menu.id);
                          setOpen(false);
                        }}
                      >
                        {menu.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Nouveau menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau menu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="newMenu">Nom du menu</Label>
                <Input
                  id="newMenu"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="Ex: Menu déjeuner, Menu gastronomique, etc."
                />
              </div>
              <Button
                onClick={createNewMenu}
                disabled={!newMenuName.trim()}
                className="w-full"
              >
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
