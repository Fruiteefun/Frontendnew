import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FruiteeLogo } from "../components/FruiteeLogo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, X, Check } from "lucide-react";
import { Instagram, Twitter, Facebook, Youtube, Linkedin } from "lucide-react";
import { isValidEmail, isValidPhone, isValidPassword, isNotEmpty } from "../lib/validation";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    userType: "",
  });

  const validateSignIn = () => {
    const e = {};
    if (!isValidEmail(formData.email)) e.email = "Please enter a valid email address";
    if (!isNotEmpty(formData.password)) e.password = "Password is required";
    if (!isNotEmpty(formData.userType)) e.userType = "Please select your role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignUp = () => {
    const e = {};
    if (!isNotEmpty(formData.name)) e.name = "Full name is required";
    if (!isValidEmail(formData.email)) e.email = "Please enter a valid email address";
    if (!isValidPassword(formData.password)) e.password = "Password must be at least 8 characters";
    if (!isValidPhone(formData.phone)) e.phone = "Please enter a valid phone number (digits only)";
    if (!isNotEmpty(formData.userType)) e.userType = "Please select your role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setErrors({});

    if (type === "signin" && !validateSignIn()) return;
    if (type === "signup" && !validateSignUp()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Store user type for sidebar/settings routing
      localStorage.setItem("fruitee_userType", formData.userType);
      if (type === "signin") {
        // Returning user → straight to their hub
        if (formData.userType === "influencer") {
          localStorage.setItem("fruitee_influencer_registered", "true");
          navigate("/dashboard");
        } else {
          navigate("/brands");
        }
      } else {
        // New user → registration flow
        if (formData.userType === "influencer") {
          localStorage.removeItem("fruitee_influencer_registered");
          localStorage.removeItem("fruitee_influencer_progress");
          navigate("/influencer-profile", { state: { fullName: formData.name, phone: formData.phone } });
        } else {
          navigate("/profile", { state: { fullName: formData.name, phone: formData.phone } });
        }
      }
    }, 1000);
  };

  const SocialIcons = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <Instagram className="absolute top-[20%] left-[10%] w-24 h-24 text-pink-500" />
      <Facebook className="absolute top-[15%] left-[45%] w-32 h-32 text-blue-500" />
      <Twitter className="absolute top-[10%] right-[15%] w-20 h-20 text-sky-500" />
      <Youtube className="absolute bottom-[30%] left-[5%] w-28 h-28 text-red-500 rotate-[-15deg]" />
      <Linkedin className="absolute bottom-[20%] right-[10%] w-24 h-24 text-blue-600" />
      <Instagram className="absolute top-[60%] right-[25%] w-16 h-16 text-purple-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-background flex items-center justify-center p-6 relative" data-testid="signin-page">
      <SocialIcons />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <FruiteeLogo size="large" />
          <p className="text-muted-foreground mt-2">Welcome back! Sign in to continue</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-floating border border-white/50 p-8">
          <Tabs defaultValue="signin" className="w-full" onValueChange={() => setErrors({})}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 rounded-xl p-1">
              <TabsTrigger
                value="signin"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                data-testid="signin-tab"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                data-testid="signup-tab"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, "signin")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@company.com"
                      className={`pl-10 h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.email ? "border-red-400" : ""}`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      data-testid="signin-email-input"
                    />
                  </div>
                  <FieldError message={errors.email} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.password ? "border-red-400" : ""}`}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      data-testid="signin-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <FieldError message={errors.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-role">Role</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value })}
                  >
                    <SelectTrigger className={`h-12 rounded-xl border-gray-200 bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.userType ? "border-red-400" : ""}`} data-testid="signin-role-select">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={4}
                      className="bg-white border border-gray-200 shadow-lg rounded-xl"
                    >
                      <SelectItem value="influencer" className="py-3 px-4 cursor-pointer hover:bg-orange-50 rounded-lg">Influencer</SelectItem>
                      <SelectItem value="business" className="py-3 px-4 cursor-pointer hover:bg-orange-50 rounded-lg">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.userType} />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
                  data-testid="signin-submit-btn"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium mt-2"
                  data-testid="forgot-password-link"
                >
                  Forgot Password?
                </button>
              </form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className={`pl-10 h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.name ? "border-red-400" : ""}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="signup-name-input"
                    />
                  </div>
                  <FieldError message={errors.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@company.com"
                      className={`pl-10 h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.email ? "border-red-400" : ""}`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      data-testid="signup-email-input"
                    />
                  </div>
                  <FieldError message={errors.email} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.password ? "border-red-400" : ""}`}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      data-testid="signup-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <FieldError message={errors.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Mobile</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className={`pl-10 h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.phone ? "border-red-400" : ""}`}
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[+\d\s()\-]*$/.test(val)) {
                          setFormData({ ...formData, phone: val });
                        }
                      }}
                      data-testid="signup-phone-input"
                    />
                  </div>
                  <FieldError message={errors.phone} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-type">I am a...</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value })}
                  >
                    <SelectTrigger className={`h-12 rounded-xl border-gray-200 bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.userType ? "border-red-400" : ""}`} data-testid="signup-usertype-select">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper" 
                      sideOffset={4}
                      className="bg-white border border-gray-200 shadow-lg rounded-xl"
                    >
                      <SelectItem value="influencer" className="py-3 px-4 cursor-pointer hover:bg-orange-50 rounded-lg">Influencer</SelectItem>
                      <SelectItem value="business" className="py-3 px-4 cursor-pointer hover:bg-orange-50 rounded-lg">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.userType} />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 relative z-0"
                  data-testid="signup-submit-btn"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-floating p-8 w-full max-w-md relative" data-testid="forgot-password-modal">
            <button
              onClick={() => { setForgotPasswordOpen(false); setForgotSent(false); setResetComplete(false); setForgotEmail(""); setResetToken(""); setNewPassword(""); }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              data-testid="close-forgot-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {resetComplete ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-outfit text-xl font-semibold">Password Reset</h3>
                <p className="text-sm text-muted-foreground">Your password has been reset successfully. You can now sign in with your new password.</p>
                <Button
                  onClick={() => { setForgotPasswordOpen(false); setResetComplete(false); }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold"
                  data-testid="back-to-signin-btn"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : forgotSent ? (
              <div className="space-y-4">
                <h3 className="font-outfit text-xl font-semibold">Reset Your Password</h3>
                <p className="text-sm text-muted-foreground">Enter the reset token sent to <strong>{forgotEmail}</strong> and your new password.</p>
                <div className="space-y-2">
                  <Label>Reset Token</Label>
                  <Input
                    placeholder="Enter token from email"
                    className="h-12 rounded-xl border-gray-200"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    data-testid="reset-token-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Min 8 characters"
                    className="h-12 rounded-xl border-gray-200"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    data-testid="new-password-input"
                  />
                </div>
                <Button
                  onClick={() => { if (resetToken && newPassword.length >= 8) setResetComplete(true); }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold"
                  data-testid="reset-password-btn"
                >
                  Reset Password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-outfit text-xl font-semibold">Forgot Password?</h3>
                <p className="text-sm text-muted-foreground">Enter your email address and we'll send you a reset link.</p>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="pl-10 h-12 rounded-xl border-gray-200"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      data-testid="forgot-email-input"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => { if (isValidEmail(forgotEmail)) setForgotSent(true); }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold"
                  data-testid="send-reset-btn"
                >
                  Send Reset Link
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
