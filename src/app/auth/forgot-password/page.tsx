"use client";

import Link from "next/link";
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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        toast({
          title: "Email envoyé",
          description:
            "Si cette adresse existe, un email de réinitialisation a été envoyé.",
        });
      } else {
        toast({
          title: " Erreur",
          description: "Une erreur est survenue. Veuillez réessayer.",
          variant: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: " Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "error",
        duration: 3000,
      });
      console.error("error ==> ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      description="Entrez votre email pour réinitialiser votre mot de passe"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-sm">
        <Link href="/auth/login" className="text-primary hover:underline">
          Retourner à la page de connexion
        </Link>
      </div>
    </AuthLayout>
  );
}
