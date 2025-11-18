import { useNavigate } from "react-router-dom";
import { UserStore } from "../store/Userstroe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function ProfileRight() {
  const { user } = UserStore();
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    if (user?._id) {
      localStorage.setItem("id", user._id);
      navigate(`/profile/${user._id}`);
    }
  };

  const userInitials = user?.username
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="h-full flex flex-col bg-card p-4 sm:p-5 space-y-4 lg:space-y-6 overflow-y-auto">
      {/* Profile Card */}
      <Card
        className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer shadow-sm"
        onClick={handleNavigateToProfile}
      >
        <CardHeader className="pb-3 text-center">
          <div className="flex justify-center mb-3">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-sm font-semibold truncate">
            {user?.username || "User"}
          </CardTitle>
          <p className="text-xs text-muted-foreground truncate mt-1">
            {user?.email || "No email"}
          </p>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[
          { label: "Notes", value: user?.notesCount || 0 },
          { label: "Friends", value: user?.friendsCount || 0 },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-card border-border shadow-sm">
            <CardContent className="pt-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Report */}
      <Card className="bg-card border-border shadow-sm flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Progress Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Completion", value: 65 },
            { label: "Activity", value: 45 },
            { label: "Engagement", value: 82 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {item.value}%
                </span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button
        onClick={handleNavigateToProfile}
        className="w-full bg-primary hover:bg-primary/90"
      >
        View Full Profile
      </Button>
    </div>
  );
}