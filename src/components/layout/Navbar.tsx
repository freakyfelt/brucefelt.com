import { Link } from "@/components/common/Link";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { paths } from "@/lib/utils/url";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Icon } from "@/components/common/Icon";

const navItems = [
  { label: "Blog", path: paths.blogPosts() },
  { label: "About", path: paths.about() },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center">
        <Link
          path="/"
          variant="none"
          className="flex items-center mr-4 sm:mr-6 md:mr-10"
        >
          <span className="font-bold text-lg sm:text-xl md:text-2xl">
            The Felt Facade
          </span>
        </Link>

        <NavigationMenu
          aria-label="Main Navigation"
          className="flex-1 max-w-none justify-start"
        >
          <NavigationMenuList className="flex-1 max-w-none justify-start">
            {/* Desktop Navigation */}
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path} className="hidden sm:block">
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link path={item.path} variant="nav">
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* Mobile Navigation */}
            <NavigationMenuItem className="sm:hidden ml-auto">
              <NavigationMenuTrigger className="px-2 [&>svg:last-child]:hidden">
                <Icon name="menu" className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Toggle menu</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-3 p-4">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavigationMenuLink asChild>
                        <Link
                          path={item.path}
                          variant="nav"
                          className="block w-full"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
