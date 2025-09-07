import { SignUpForm } from "@/components/SignUpForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 sm:pb-12 pt-6 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/images/logo-small.png"
              alt="Karate Toernooi Logo"
              width={66}
              height={100}
            />
            <Image
              src="/images/logo-text.png"
              alt="Karate Toernooi Logo"
              width={200}
              height={100}
            />
          </div>
          {/* <h1 className="text-3xl font-bold text-gray-900">
            Karate Toernooi Registratie
          </h1>
          <p className="mt-2 text-gray-600">
            Meld je aan voor het aankomende karate toernooi
          </p> */}
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
