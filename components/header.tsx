"use client";
import { Briefcase, X, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/login");
  };

  const handlePostJob = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login?callbackUrl=/dashboard");
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">JobiGolk</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="font-medium text-blue-600">
                Home
              </Link>
              <Link
                href="/jobs"
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Browse Jobs
              </Link>
              <Link
                href="/about"
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!session && (
                <Button
                  variant="outline"
                  className="font-medium"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              )}
              <Button
                className="bg-blue-600 hover:bg-blue-700 font-medium"
                onClick={handlePostJob}
              >
                Post a Job
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4 pb-4">
                <Link href="/" className="font-medium text-blue-600 py-2">
                  Home
                </Link>
                <Link
                  href="/jobs"
                  className="font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                >
                  Browse Jobs
                </Link>

                <Link
                  href="/about"
                  className="font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                >
                  Contact
                </Link>
                <div className="flex space-x-4 pt-2">
                  <Button
                    variant="outline"
                    className="font-medium flex-1"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 font-medium flex-1"
                    onClick={handlePostJob}
                  >
                    Post a Job
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
