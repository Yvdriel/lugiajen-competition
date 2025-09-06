import { SignUpForm } from "@/components/SignUpForm"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Karate Toernooi Registratie
          </h1>
          <p className="mt-2 text-gray-600">
            Meld je aan voor het aankomende karate toernooi
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
