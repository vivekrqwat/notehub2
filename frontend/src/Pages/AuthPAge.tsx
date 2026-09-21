import { useNavigate, Link } from "react-router-dom"
import { UseAuth } from "../Context/Useauth"
import { useState, type FormEvent } from "react"
import { ArrowRight, Check, Quote } from "lucide-react"



// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"

// Replace with your actual Brand component/import
import { Brand } from "../Layout/Brand"
import { Button } from "../Components/ui/button"
import { Input } from "../Components/ui/input"
import { Card, CardContent } from "../Components/ui/card"
import { Label } from "../Components/ui/label"

type AuthMode = "login" | "sign up"
type LoginMethod = "password" | "otp"

export const AuthPage = ({ mode }: { mode: AuthMode }) => {
  const isLogin = mode === "login"
  const navigate = useNavigate()
  const { login, signup, sendOtp, verifyOtp, loading, Error } = UseAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (isLogin) {
        if (loginMethod === "otp") {
          if (!otpSent) {
            await sendOtp(email)
            setOtpSent(true)
            return
          }
          await verifyOtp(email, otp)
        } else {
          await login(email, password)
        }
      } else {
        await signup(email, password)
      }
      navigate(isLogin ? "/home" : "/login")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background text-foreground">
      {/* Left / aside branding panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-muted/40 border-r">
        <Brand />

        <div className="space-y-4 max-w-md">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            A home for your thinking
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Keep the good
            <br />
            <em className="italic text-primary">ideas close.</em>
          </h1>
          <p className="text-muted-foreground">
            Notehub gives your thoughts a place to land, grow, and find their
            way back to you.
          </p>
        </div>

        <div className="flex gap-3 max-w-md text-muted-foreground">
          <Quote className="shrink-0 mt-1" size={18} />
          <div>
            <p className="italic">
              The best ideas are the ones you can find again.
            </p>
            <small className="block mt-1 text-xs uppercase tracking-wide">
              — Notehub principle 01
            </small>
          </div>
        </div>
      </div>

      {/* Right / form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-md border-none shadow-none sm:border sm:shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-6 flex justify-center lg:hidden">
              <Brand />
            </div>

            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {isLogin ? "Welcome back" : "Start your collection"}
            </p>
            <h2 className="text-2xl font-semibold mt-1">
              {isLogin ? "Sign in to Notehub" : "Create your account"}
            </h2>
            <p className="text-muted-foreground mt-1 mb-6">
              {isLogin
                ? "Pick up where you left off."
                : "A clear place for your best ideas."}
            </p>

            {isLogin && (
              <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("password")
                    setOtpSent(false)
                    setOtp("")
                  }}
                  className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                    loginMethod === "password"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("otp")
                    setPassword("")
                  }}
                  className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                    loginMethod === "otp"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  One-time code
                </button>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Vivek Rajawat"
                    required
                  />
                </div>
              )}

              {isLogin && loginMethod === "otp" ? (
                <div className="space-y-2">
                  <Label htmlFor="otp">
                    {otpSent ? "Verification code" : "One-time code"}
                  </Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder={otpSent ? "Enter the 6-digit code" : "Code will be sent to your email"}
                    required={otpSent}
                    disabled={!otpSent}
                  />
                  {otpSent && (
                    <p className="text-xs text-muted-foreground">
                      Check your email for the code.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
              )}

              {Error && (
                <p className="text-sm text-destructive font-medium">
                  {Error}
                </p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Please wait..."
                  : isLogin && loginMethod === "otp"
                    ? otpSent
                      ? "Verify code"
                      : "Send code"
                  : isLogin
                    ? "Continue to workspace"
                    : "Create my workspace"}
                {!loading && <ArrowRight size={17} className="ml-2" />}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                to={isLogin ? "/signup" : "/login"}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
              <Check size={14} /> Your notes are yours, always.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
