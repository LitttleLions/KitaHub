import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from './Logo';
// Import Feather icon
import { User, ChevronDown, Search, MapPin, BookOpen, Briefcase, Heart, GraduationCap, Feather } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Modified navigationItems array
const navigationItems = [
  { 
    name: "Kita-Suche", // Renamed from Kitas
    href: "/kitas",    // Main link still points to the list view
    dropdown: [
      { 
        name: "Alle Kitas (Liste)", // Clarified main search link
        href: "/kitas", 
        description: "Durchsuchen Sie alle Kitas in der Listenansicht",
        icon: Search 
      },
      { 
        name: "Umkreissuche (Karte)", // Added Map Search
        href: "/kitas/map-search", 
        description: "Finden Sie Kitas interaktiv auf der Karte",
        icon: MapPin 
      },
      { 
        name: "Kita-Matching", // Added Matching link here as per PRD structure
        href: "/matching", 
        description: "Lassen Sie sich passende Kitas vorschlagen",
        icon: Heart 
      }
    ]
  },
  { 
    name: "Jobbörse", 
    href: "/jobboard",
    dropdown: [
      { 
        name: "Stellenangebote", 
        href: "/jobs", 
        description: "Aktuelle Jobs im pädagogischen Bereich",
        icon: Briefcase 
      },
      { 
        name: "Jobsuche", 
        href: "/jobboard", 
        description: "Gezielt nach Jobs suchen und filtern",
        icon: Search 
      }
    ]
  },
  // { name: "Matching", href: "/matching", icon: Heart }, // Moved under Kita-Suche
  { name: "E-Learning", href: "/elearning", icon: GraduationCap },
  // Updated "Wissen" to be a dropdown
  { 
    name: "Wissen", 
    href: "/wissen", // Main link still points to overview
    dropdown: [
      { 
        name: "Wissens-Übersicht", 
        href: "/wissen", 
        description: "Artikel und Ratgeber für Eltern & Fachkräfte",
        icon: BookOpen 
      },
      { 
        name: "Kindergeschichten", // New link to Kinderwelt
        href: "/kinderwelt", 
        description: "Spannende Geschichten zum Vorlesen und Entdecken",
        icon: Feather // Use Feather icon
      }
      // Hier könnten später dynamisch Kategorien hinzugefügt werden
    ]
  }, 
  { 
    name: "Guides", 
    href: "#", // Keep href="#" if it's just a trigger
    dropdown: [
      { name: "Für Erzieher", href: "/guides/erzieher" },
      { name: "Für Eltern", href: "/guides/eltern" },
      { name: "Bewerbungstipps", href: "/guides/bewerbung" },
      { name: "Ausbildung", href: "/guides/ausbildung" },
      { name: "Gehalt", href: "/guides/gehalt" },
      { name: "Gesundheit", href: "/guides/gesundheit" },
      { name: "Rechtliches", href: "/guides/rechtliches" }
    ]
  }
];

const Navbar = () => {
  const location = useLocation();
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-grow justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                item.dropdown ? (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-kita-orange focus:text-kita-orange transition-colors">
                      {/* Link removed from trigger if it only opens dropdown */}
                      {item.name} 
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 w-[400px]">
                        {item.dropdown.map((subItem) => (
                          <li key={subItem.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={subItem.href}
                                className="flex items-start rounded-md p-3 hover:bg-gray-50 transition-colors"
                              >
                                {subItem.icon && <subItem.icon className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{subItem.name}</div>
                                  {subItem.description && (
                                    <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                  )}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors",
                        location.pathname === item.href 
                          ? "text-kita-orange after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-kita-orange" 
                          : "text-gray-700 hover:text-kita-orange after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-kita-orange hover:after:w-full after:transition-all after:duration-300"
                      )}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuItem>
                )
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Action Buttons - Right Aligned */}
        <div className="hidden md:flex items-center space-x-2">
           {/* TODO: Add logic to show "Mein Profil" (outline) when logged in */}
           <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:border-kita-orange hover:text-kita-orange transition-colors">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="bg-kita-orange hover:bg-kita-orange/90">
            <Link to="/register">Registrieren</Link>
          </Button>
           {/* TODO: Add Profile Dropdown back when user is logged in */}
           {/* <DropdownMenu> ... </DropdownMenu> */}
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center">
          <Collapsible
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="mb-4">
                <span className="sr-only">Toggle Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "h-4 w-4 transition-transform",
                    mobileMenuOpen ? "rotate-90" : ""
                  )}
                >
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </>
                  )}
                </svg>
              </Button>
            </CollapsibleTrigger>
            {/* Mobile Navigation Content */}
            <CollapsibleContent className="absolute left-0 right-0 top-full bg-white shadow-lg p-4 z-50 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                {/* Mobile Menu Items */}
                {navigationItems.map((item) =>
                  item.dropdown ? (
                    <Collapsible key={item.name} className="w-full">
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 text-left font-medium">
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pl-4 pt-2 pb-2">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              className="flex items-center py-2 text-sm hover:text-kita-orange"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.icon && <subItem.icon className="h-4 w-4 mr-2 text-kita-orange" />}
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "px-2 py-2 text-sm font-medium flex items-center",
                        location.pathname === item.href
                          ? "text-kita-orange"
                          : "text-gray-700 hover:text-kita-orange"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {item.name}
                    </Link>
                  )
                )}
                {/* Mobile Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-gray-100">
                  <Button asChild variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-kita-orange hover:bg-kita-orange/90">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Registrieren</Link>
                  </Button>
                   {/* TODO: Add mobile profile button/link */}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
