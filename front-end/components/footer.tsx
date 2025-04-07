import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Resort Info */}
          <div>
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                style={{ backgroundColor: "#2dd4bf" }}
              >
                C
              </div>
              <div>
                <h3 className="font-bold">Chill Haven</h3>
                <p className="text-xs">Resort & Spa</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 text-sm">
              Chill Haven Resort & Spa offers a sanctuary for healing and relaxation, where nature and modern comfort
              blend to create the perfect retreat from everyday stress.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  호텔 소개
                </Link>
              </li>
              <li>
                <Link href="/directions" className="text-gray-400 hover:text-white transition-colors text-sm">
                  오시는 길
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  연락처
                </Link>
              </li>
            </ul>
          </div>

          {/* Rooms */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Rooms</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms/comfort" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Comfort Room
                </Link>
              </li>
              <li>
                <Link href="/rooms/harmony" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Harmony Room
                </Link>
              </li>
              <li>
                <Link href="/rooms/serenity" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Serenity Room
                </Link>
              </li>
              <li>
                <Link href="/rooms/family" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Family Suite
                </Link>
              </li>
              <li>
                <Link href="/rooms/lake" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Lake Suite
                </Link>
              </li>
              <li>
                <Link href="/rooms/ultimate" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Ultimate Chill Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Facilities</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/facilities/wellness" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Wellness Center
                </Link>
              </li>
              <li>
                <Link href="/facilities/spa" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Serenity Spa
                </Link>
              </li>
              <li>
                <Link href="/facilities/nature" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Nature Chill Zone
                </Link>
              </li>
              <li>
                <Link href="/facilities/lounge" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Chill Lounge & Entertainment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Contact & Copyright */}
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-4 uppercase">Contact</h3>
            <address className="not-italic text-gray-400 text-sm">
              <p>서울특별시 중구 필동로 123</p>
              <p>TEL: 02-123-4567</p>
              <p>FAX: 02-123-4568</p>
              <p>Email: info@chillhaven.com</p>
            </address>
          </div>
          <div className="text-gray-500 text-sm self-end">
            <p>© {new Date().getFullYear()} Chill Haven Resort & Spa. All Rights Reserved.</p>
            <div className="flex space-x-4 mt-2 justify-end">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

