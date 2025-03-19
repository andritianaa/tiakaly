"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthLayout } from "../components/auth-layout";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true);
    const token = searchParams.get("token");
    if (!token) {
      toast({
        title: "Erreur",
        description: "Token de réinitialisation manquant.",
        variant: "error",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });
      if (response.ok) {
        toast({
          title: "Succès",
          description: "Votre mot de passe a été réinitialisé.",
        });
        router.push("/auth/login");
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description:
            data.error || "Une erreur est survenue. Veuillez réessayer.",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Réinitialiser le mot de passe"
      description="Entrez votre nouveau mot de passe"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nouveau mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Réinitialisation..."
              : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
