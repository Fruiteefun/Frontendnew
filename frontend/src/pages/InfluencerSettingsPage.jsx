import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Mail,
  Lock,
  User,
  Settings2,
  Sparkles,
  CreditCard,
  DollarSign,
  FileText,
  Download,
  ArrowLeft,
  LogOut,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react";

const InfluencerSettingsPage = () => {
  const navigate = useNavigate();
  const [autoRenew, setAutoRenew] = useState(true);

  const invoices = [
    { id: "INV-001", date: "2026-03-01", amount: "$120.00" },
    { id: "INV-002", date: "2026-02-01", amount: "$120.00" },
    { id: "INV-003", date: "2026-01-01", amount: "$120.00" },
  ];

  const payments = [
    { id: "PAY-001", date: "2026-03-10", amount: "$450.00", status: "received" },
    { id: "PAY-002", date: "2026-02-15", amount: "$300.00", status: "due" },
    { id: "PAY-003", date: "2026-01-20", amount: "$600.00", status: "received" },
  ];

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-3xl mx-auto" data-testid="influencer-settings-page">
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

        <div className="space-y-6">
          {/* Email */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">creator@example.com</p>
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
                to="/influencer-profile"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                data-testid="edit-profile-link"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Edit Profile</span>
              </Link>
              <Link
                to="/business-preferences"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                data-testid="edit-preferences-link"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Edit Preferences</span>
              </Link>
              <Link
                to="/create-digital-twin"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                data-testid="edit-twin-link"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Edit Digital Twin</span>
              </Link>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-teal-500" />
              <h2 className="font-outfit text-lg font-semibold">Subscription</h2>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-foreground">Pro Creator Plan</p>
                <p className="text-sm text-muted-foreground">$120/month</p>
              </div>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-100">
              <span className="text-muted-foreground">Auto-renew</span>
              <Switch
                checked={autoRenew}
                onCheckedChange={setAutoRenew}
                data-testid="auto-renew-switch"
              />
            </div>

            {/* Invoices */}
            <div className="mt-4">
              <h3 className="font-medium mb-3">Invoices</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h2 className="font-outfit text-lg font-semibold">Payments</h2>
            </div>

            {/* Payment Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                <p className="text-2xl font-outfit font-bold text-green-600">$1,350.00</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
                <p className="text-2xl font-outfit font-bold text-yellow-600">$300.00</p>
                <p className="text-sm text-muted-foreground">Payments Due</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                <p className="text-2xl font-outfit font-bold text-blue-600">$1,050.00</p>
                <p className="text-sm text-muted-foreground">Received</p>
              </div>
            </div>

            {/* Payment History */}
            <h3 className="font-medium mb-3">Payment History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "received"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status === "received" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      </div>
    </Layout>
  );
};

export default InfluencerSettingsPage;
