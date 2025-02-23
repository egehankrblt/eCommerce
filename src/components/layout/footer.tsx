import Link from "next/link"
import { storeName } from "public/data/storeConfig"

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <Link href="/about" className="block hover:text-theme-secondary mb-2">
              About {storeName}
            </Link>
            <Link href="/contact" className="block hover:text-theme-secondary mb-2">
              Contact Us
            </Link>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <Link href="/support" className="block hover:text-theme-secondary mb-2">
              Customer Service
            </Link>
            <Link href="/faq" className="block hover:text-theme-secondary mb-2">
              FAQ
            </Link>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <Link href="/privacy" className="block hover:text-theme-secondary mb-2">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block hover:text-theme-secondary mb-2">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center">
          <p>&copy; 2023 {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

