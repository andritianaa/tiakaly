"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactType } from "@prisma/client";

import type { ContactInput } from "@/types/place";
// Modifiez l'interface ContactsInputProps pour accepter un Dispatch
interface ContactsInputProps {
  value: ContactInput[];
  onChange: (
    value: ContactInput[] | ((prev: ContactInput[]) => ContactInput[])
  ) => void;
}

export function ContactsInput({ value, onChange }: ContactsInputProps) {
  const [contactType, setContactType] = useState<ContactType>(
    ContactType.mobile
  );
  const [contactValue, setContactValue] = useState("");

  const addContact = () => {
    if (contactValue.trim()) {
      onChange([...value, { type: contactType, value: contactValue }]);
      setContactValue("");
    }
  };

  const removeContact = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>Contacts</Label>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {value.length > 0 ? (
              <div className="space-y-2">
                {value.map((contact, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-24 text-sm font-medium">
                      {contact.type === ContactType.mobile
                        ? "Mobile"
                        : contact.type === ContactType.fixe
                        ? "Fixe"
                        : "Email"}
                    </div>
                    <div className="flex-1">{contact.value}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun contact ajouté
              </p>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="contactType">Type</Label>
                <Select
                  value={contactType}
                  onValueChange={(value) =>
                    setContactType(value as ContactType)
                  }
                >
                  <SelectTrigger id="contactType">
                    <SelectValue placeholder="Type de contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContactType.mobile}>Mobile</SelectItem>
                    <SelectItem value={ContactType.fixe}>Fixe</SelectItem>
                    <SelectItem value={ContactType.email}>Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="contactValue">Valeur</Label>
                <Input
                  id="contactValue"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    contactType === ContactType.email
                      ? "email@exemple.com"
                      : contactType === ContactType.mobile
                      ? "06 12 34 56 78"
                      : "01 23 45 67 89"
                  }
                />
              </div>
              <Button onClick={addContact} disabled={!contactValue.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
