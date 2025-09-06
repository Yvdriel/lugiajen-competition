"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  karateSchool: z.string().min(2, "Karate school must be at least 2 characters"),
  beltColor: z.string().min(1, "Please select a belt color"),
  age: z.number().min(5, "Age must be at least 5").max(100, "Age must be less than 100"),
  email: z.string().email("Please enter a valid email"),
  kata: z.boolean(),
  kumite: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

const beltColors = [
  "Wit",
  "Geel",
  "Oranje",
  "Groen",
  "Blauw",
  "Bruin (3e, 2e en 1e kyu)",
  "Zwart (1e dan of hoger)",
]

export function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      karateSchool: "",
      beltColor: "",
      age: 0,
      email: "",
      kata: false,
      kumite: false,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contestants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setPaymentUrl(result.paymentUrl)
      } else {
        console.error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (paymentUrl) {
    if (typeof window !== "undefined") {
      window.location.href = paymentUrl
    }


    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Registratie Succesvol!</CardTitle>
          <CardDescription>
            Voltooi je betaling om je registratie te bevestigen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
              Pay Now
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Karate Tournament Registratie</CardTitle>
        <CardDescription>
          Meld je aan voor het aankomende karate toernooi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voornaam</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achternaam</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="karateSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Karate School</FormLabel>
                  <FormControl>
                    <Input placeholder="Jouw Karate School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beltColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Huidige Bandkleur</FormLabel>
                  <Select  onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger 
                      className="hover:cursor-pointer">
                        <SelectValue placeholder="Selecteer bandkleur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {beltColors.map((color) => (
                        <SelectItem 
                      className="hover:cursor-pointer" key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leeftijd</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="18"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
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
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Deelnemer Type</FormLabel>
              <div className="flex gap-8 items-center space-x-2">
                <FormField
                  control={form.control}
                  name="kata"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          className="h-6 w-6 hover:cursor-pointer"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Kata</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kumite"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          className="h-6 w-6 hover:cursor-pointer"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Kumite</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-10 hover:cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Registreer"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
