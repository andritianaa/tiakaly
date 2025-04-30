"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthLayout } from '../components/auth-layout';

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
  }),
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        document.cookie = `auth-token=${
          data.token
        }; path=/; expires=${expirationDate.toUTCString()}`;

        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
        router.push("/");
      } else {
        // Gestion des erreurs spécifiques (inchangée)
        if (data.error === "Email already in use") {
          form.setError("email", {
            type: "manual",
            message: "Cette adresse email est déjà utilisée.",
          });
        } else if (data.error === "Username already in use") {
          form.setError("username", {
            type: "manual",
            message: "Ce nom d'utilisateur est déjà pris.",
          });
        } else {
          toast({ title: "Erreur", description: data.error, variant: "error" });
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "error",
      });
      console.error("error ==> ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome, create your account"
      description="Entres tes informations pour créer un compte"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Nom d'utilisateur"}</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="exemple@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full hover-lift transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-sm">
        Déjà un compte ?{" "}
        <a href="/auth/login" className="text-primary hover:underline">
          Se connecter
        </a>
      </div>
    </AuthLayout>
  );
}
