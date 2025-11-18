import axios from "axios";
import { useState, useEffect } from "react";
import { UserStore } from "../store/Userstroe";
import Upload from "../utils/Upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImagePlus, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function Discussion() {
  const [post, setPost] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState();
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { user } = UserStore();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/apii/post/`);
      setPost(res.data);
    } catch (e) {
      console.log(e);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.warning("Please write a message");
      return;
    }

    try {
      let imgUrl = "";
      setloading(true);
      
      if (image) {
        imgUrl = await Upload(image);
      }

      const postdata = {
        uid: "",
        username: user.username,
        email: user?.email,
        desc: message,
        img: imgUrl,
      };

      await axios.post(`${API}/apii/post/`, postdata, {
        withCredentials: true,
      });

      setMessage("");
      setImage(null);
      setPreviewImage(null);
      fetchPosts();
      toast.success("Post published successfully!");
    } catch (e) {
      console.log("Post error:", e);
      toast.error("Failed to publish post");
    } finally {
      setloading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const userInitials = user?.username
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="h-[calc(100vh-100px)] w-full bg-background rounded-lg p-4 flex flex-col overflow-hidden">
      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            Publishing your post...
          </p>
        </div>
      )}

      {/* Posts Feed */}
      {!loading && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
          {post.length > 0 ? (
            post.map((p) => (
              <Card
                key={p._id}
                className="bg-card border-border hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-4 space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {p.username
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {p.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.email}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-foreground leading-relaxed">
                    {p.desc}
                  </p>

                  {/* Image */}
                  {p.img && (
                    <img
                      src={p.img}
                      alt="post-image"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                No posts yet. Be the first to share!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <Card className="bg-card border-border shadow-lg">
        <CardContent className="p-4 space-y-3">
          {/* Image Preview */}
          {previewImage && (
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="preview"
                className="h-20 w-20 object-cover rounded-lg border border-border"
              />
              <button
                onClick={() => {
                  setImage(null);
                  setPreviewImage(null);
                }}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90"
              >
                ×
              </button>
            </div>
          )}

          {/* Input Section */}
          <div className="flex items-end gap-2">
            <label className="cursor-pointer">
              <div className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <ImagePlus className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
            </label>

            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSend();
                }
              }}
              disabled={loading}
              className="flex-1 bg-muted border-0 text-foreground placeholder:text-muted-foreground"
            />

            <Button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}