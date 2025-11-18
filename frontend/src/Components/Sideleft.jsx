import {
  Folder,
  Users,
  UsersRound,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserStore } from "../store/Userstroe";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SideLeft() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = UserStore();

  const items = [
    { icon: Folder, label: "Directory", path: "/dir" },
    // { icon: Users, label: "Friends", path: "/" },
    { icon: UsersRound, label: "Collaboration", path: "/collab" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="h-full flex flex-col bg-card overflow-y-auto">
      <div className="flex-1 p-2 sm:p-3 space-y-2">
        {/* Profile Button - Visible on mobile/tablet */}
        <Button
          onClick={() => navigate(`profile/${user?._id}`)}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-3 lg:hidden",
            isActive(`profile/${user?._id}`)
              ? "bg-primary text-primary-foreground hover:bg-primary"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
          title="Profile"
        >
          <User className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline text-xs truncate">Profile</span>
        </Button>

        {/* Divider */}
        <div className="border-t border-border lg:hidden my-1" />

        {/* Navigation Items */}
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={index}
              onClick={() => navigate(item.path)}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-3 transition-all",
                active
                  ? "bg-primary text-primary-foreground hover:bg-primary"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden sm:inline text-xs truncate">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Decorative Footer */}
      <div className="p-2 sm:p-3 border-t border-border">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
      </div>
    </aside>
  );
}