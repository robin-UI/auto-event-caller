import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header({ user }: { user: User | null }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const logOut = async () => {
    // localStorage.removeItem("token");
    // document.cookie.split(";").forEach((cookie) => {
    //   document.cookie =
    //     cookie.split("=")[0].trim() +
    //     "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // });
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    window.location.reload();
    // const data = await res.json();
    // if (res.ok) {
    //   window.location.href = data.redirect;
    // }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Left – Title */}
        <span className="text-lg font-semibold tracking-tight">
          📅 Event Reminder
        </span>

        {/* Right – Avatar + Logout */}
        <div className="flex items-center gap-3">
          {/* Profile avatar */}
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground select-none">
            {initials}
          </div> */}
          <Avatar>
            <AvatarImage src={user?.picture || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {user?.name && (
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user.name}
            </span>
          )}

          <Button variant="outline" size="sm" onClick={logOut}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
