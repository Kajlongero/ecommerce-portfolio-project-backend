import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { AuthButtons } from "./Buttons/AuthButtons";
import { CommerceButtons } from "./Buttons/CommerceButtons";
import { LogoSVGComponent } from "../SVG/Logo";
import { LEFT_NAVLINKS } from "@/links/navlinks";
import { DarkModeButton } from "./Buttons/DarkMode";

type Props = {
  isDark: boolean;
};

export const Navbar = ({ isDark }: Props) => {
  const user: boolean = false;

  return (
    <header className="w-full h-24 dark:text-white text-black">
      <nav className="w-full flex py-4 px-4 sm:px-6 md:px-8 lg:px-8 items-center">
        <div className="flex-1 flex items-center gap-6">
          <Link href="/">
            <LogoSVGComponent size="medium" />
          </Link>
          <ul className="max-md:hidden flex gap-6">
            {LEFT_NAVLINKS.map((elem) => {
              const id: string = uuidv4();

              return (
                <li key={id}>
                  <Link href={elem.path}>{elem.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="max-sm:hidden"></div>
        {user ? <CommerceButtons /> : <AuthButtons />}
        <DarkModeButton isDark={isDark} />
      </nav>
    </header>
  );
};
