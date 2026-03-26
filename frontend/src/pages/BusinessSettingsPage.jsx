import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { userApi } from "../lib/api";
import {
  Mail,
  Lock,
  User,
  Settings2,
  Tag,
  ArrowLeft,
  LogOut,
  AlertTriangle,
  Trash2,
  Loader2,
} from "lucide-react";

const BusinessSettingsPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userApi.getMe();
        if (res.success && res.data) {
          setEmail(res.data.email || "");
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    loadUser();
  }, []);

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="business-settings-page">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:bg-muted transition-colors"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-outfit text-4xl font-bold text-foreground">
            Settings
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : (
        <div className="space-y-6">
          {/* Email */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground" data-testid="user-email">{email}</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your login credentials</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-xl border-gray-200 hover:bg-muted"
                data-testid="change-password-btn"
              >
                Change
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-outfit text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link
                to="/profile"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                data-testid="edit-profile-link"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Edit Profile</span>
              </Link>
              <Link
                to="/brands"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                data-testid="manage-brands-link"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Manage Brands</span>
              </Link>
              <Link
                to="/business-preferences"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                data-testid="edit-preferences-link"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Edit Preferences</span>
              </Link>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-outfit text-lg font-semibold mb-4">Account</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                data-testid="disable-account-btn"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Disable Account
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                data-testid="delete-account-btn"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={() => navigate("/signin")}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessSettingsPage;
