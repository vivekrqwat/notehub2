import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GitGraph from "./GitGraph";
import scientist from "../avatar/scientist.png";
import { UserStore } from "../store/Userstroe";
import { Trash2, Edit2, Award } from "lucide-react";
import Delete from "../utils/Delete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { id } = useParams();
  const [userdata, setuserdata] = useState({});
  const { user, post, postdata, notes, notedata } = UserStore();
  const [listdata, setlistdata] = useState();
  const [listname, setlistname] = useState("posts");
  const [title, settitle] = useState({
    league: "Beginner",
    title: "Note Novice",
  });
  const [score, setscore] = useState(0);
  const [expandedImage, setexpandedImage] = useState(null);

  const delepost = async (id) => {
    try {
      if (listname === "posts") {
        await Delete("post", id);
        setlistdata((prev) => prev.filter((item) => item._id !== id));
        toast.success("Post deleted successfully");
      } else if (listname === "notes") {
        await Delete("dir", id);
        await Delete("notes", id);
        setlistdata((prev) => prev.filter((item) => item._id !== id));
        toast.success("Directory deleted successfully");
      }
    } catch (e) {
      console.log("del", e);
      toast.error("Failed to delete item");
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${API}/apii/user/${id}`, {
          withCredentials: true,
        });
        notes(id);
        post(id);
        setuserdata(res.data);
      } catch (e) {
        console.log(e);
        toast.error("Failed to fetch user data");
      }
    };
    if (id) fetchdata();
  }, [id]);

  const listtransfer = () => {
    if (listname === "posts") {
      setlistdata(postdata);
    } else if (listname === "notes") {
      setlistdata(notedata);
    }
  };

  useEffect(() => {
    listtransfer();
  }, [listname, postdata, notedata]);

  const getleauge = (n) => {
    const leagues = [
      { min: 500, max: 800, league: "Beginner", title: "Learning Sprout" },
      { min: 801, max: 1000, league: "Beginner", title: "Fresh Scriber" },
      { min: 1001, max: 1200, league: "Amateur", title: "Rising Scholar" },
      { min: 1201, max: 1500, league: "Amateur", title: "Knowledge Seeker" },
      { min: 1501, max: 1800, league: "Amateur", title: "Syllabus Explorer" },
      { min: 1801, max: 2500, league: "Professional", title: "Note Master" },
      {
        min: 2501,
        max: 3500,
        league: "Professional",
        title: "Study Strategist",
      },
      { min: 3501, max: Infinity, league: "Professional", title: "Subject Sensei" },
    ];

    const found = leagues.find((l) => n >= l.min && n <= l.max);
    if (found) {
      settitle({ league: found.league, title: found.title });
    }
  };

  useEffect(() => {
    const submissionLength = user?.submission?.length || 0;
    setscore(submissionLength);
    getleauge(submissionLength);
  }, [user]);

  const userInitials = userdata?.username
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const leagueColors = {
    Beginner: "bg-blue-100 text-blue-800",
    Amateur: "bg-purple-100 text-purple-800",
    Professional: "bg-amber-100 text-amber-800",
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile Card */}
        <Card className="md:col-span-1 bg-card border-border h-fit sticky top-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={scientist} alt={userdata?.username} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-bold">{userdata?.username}</h2>
                <p className="text-sm text-muted-foreground break-words">
                  {userdata?.email}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Trophy Section */}
            <div className="flex flex-col items-center text-center space-y-3 py-4 border-t border-border">
              <div className="text-6xl">🏆</div>
              <Badge className={`${leagueColors[title.league] || leagueColors.Beginner}`}>
                {title.league}
              </Badge>
              <h3 className="text-lg font-semibold">{title.title}</h3>
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">{score}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
              {[
                { label: "Posts", value: postdata?.length || 0 },
                { label: "Notes", value: notedata?.length || 0 },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center p-2 rounded-md bg-muted"
                >
                  <p className="text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Git Graph */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Contribution Graph</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <GitGraph activeDays={userdata?.submission} />
            </CardContent>
          </Card>

          {/* Posts & Notes Tabs */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle>Your Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="posts" onValueChange={setlistname}>
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="notes">Directories</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-3 mt-4">
                  {listdata && listdata.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {listdata.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-muted border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
                        >
                          <div className="flex justify-between items-start p-4 gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                              <p className="text-sm break-words flex-1">
                                {item.desc}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card border-border">
                                  <AlertDialogTitle>
                                    Delete Post
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this post?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                  <div className="flex gap-3 justify-end">
                                    <AlertDialogCancel className="border-border">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => delepost(item._id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          {item.img && (
                            <img
                              src={item.img}
                              alt="post"
                              className="w-full max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setexpandedImage(item.img)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No posts yet
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="space-y-3 mt-4">
                  {listdata && listdata.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {listdata.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-muted border border-border rounded-lg p-4 hover:border-primary/50 transition-colors flex justify-between items-start gap-3"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                            <p className="text-sm break-words flex-1">
                              {item.Dirname}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-border">
                                <AlertDialogTitle>
                                  Delete Directory
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this
                                  directory? This action cannot be undone.
                                </AlertDialogDescription>
                                <div className="flex gap-3 justify-end">
                                  <AlertDialogCancel className="border-border">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => delepost(item._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No directories yet
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Expansion Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setexpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="expanded"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;