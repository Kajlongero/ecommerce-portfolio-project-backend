import Link from "next/link";

export const AuthButtons = () => {
  return (
    <div className="max-sm:hidden">
      <ul className="flex flex-1 px-4 py-2 w-full gap-4">
        <li className="flex-grow">
          <Link
            href="/login"
            className="px-3 py-1 text-black border border-white dark:border-white dark:hover:text-zinc-400 hover:border-gray-500 transition-all rounded-md flex-grow block text-center dark:text-white"
          >
            Login
          </Link>
        </li>
        <li className="flex-grow">
          <Link
            href="/signup"
            className="px-3 py-1 text-black border border-white dark:border-white dark:hover:text-zinc-400 hover:border-gray-500 transition-all rounded-md flex-grow block text-center dark:text-white"
          >
            Sign up
          </Link>
        </li>
      </ul>
    </div>
  );
};
