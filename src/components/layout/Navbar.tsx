import { Link } from "@/components/common/Link";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { paths } from "@/lib/utils/url";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            path="/"
            variant="none"
            className="flex items-center"
            aria-label="Home"
          >
            <span
              className="inline-block font-bold text-xl sm:text-2xl"
              aria-hidden="true"
            >
              The Felt Facade
            </span>
          </Link>
          <NavigationMenu aria-label="Main Navigation">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link path={paths.blogPosts()} variant="nav">
                    Blog
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link path="/about" variant="nav">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
