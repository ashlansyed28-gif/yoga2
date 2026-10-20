/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import {
  X,
  ShieldCheck,
  LogOut,
  User,
  CheckCircle2,
  AlertCircle,
  Database,
  KeyRound,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export interface AuthUser {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  createdAt?: string;
}

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser, token: string) => void;
  onLogout: () => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [rawSessionToken, setRawSessionToken] = useState<string | null>(() => {
    return localStorage.getItem('sanctuary_auth_token');
  });
  const [dbUsers, setDbUsers] = useState<AuthUser[]>([]);
  const [isViewingDb, setIsViewingDb] = useState(false);

  const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isCustomClientIdSet = !!envClientId && !envClientId.includes('demo');

  // Load database users on modal open
  useEffect(() => {
    if (isOpen) {
      fetchDatabaseUsers();
    }
  }, [isOpen]);

  const fetchDatabaseUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        setDbUsers(data.users || []);
      }
    } catch {
      // quiet fail
    }
  };

  // Requirement PART 2: Step 3 & 4
  // Upon successful login callback, extract credential token and send POST to /api/auth/google
  const handleGoogleCredentialResponse = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setErrorMessage('Google returned an empty credential token. Please try again.');
      return;
    }

    await verifyTokenWithBackend(credentialResponse.credential);
  };

  const verifyTokenWithBackend = async (idToken: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to authenticate with backend server.');
      }

      // Save returned session token securely
      if (data.token) {
        localStorage.setItem('sanctuary_auth_token', data.token);
        setRawSessionToken(data.token);
      }

      setSuccessNotice(data.message || 'Authenticated successfully with Google!');
      onLoginSuccess(data.user, data.token);
      fetchDatabaseUsers();
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo sign-in for testing when Google Cloud OAuth Client ID is not yet configured
  const handleSimulatedGoogleSignIn = async (accountType: 'ashlan' | 'dr_syed' | 'guest') => {
    const profiles = {
      ashlan: {
        id: '109876543210123456789',
        email: 'ashlansyed28@gmail.com',
        name: 'Ashlan Syed',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      dr_syed: {
        id: '209876543210987654321',
        email: 'dr.syed.karishma@sanctuary.clinic',
        name: 'Dr. Syed Karishma',
        picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      guest: {
        id: `guest_${Date.now()}`,
        email: 'mindful.seeker@sanctuary.com',
        name: 'Mindful Seeker',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
    };

    const sel = profiles[accountType];
    const testToken = `test-google-token-::${sel.id}::${sel.email}::${sel.name}::${sel.picture}`;
    await verifyTokenWithBackend(testToken);
  };

  const handleLogoutClick = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // quiet
    }
    localStorage.removeItem('sanctuary_auth_token');
    setRawSessionToken(null);
    setSuccessNotice('You have been logged out peacefully.');
    setIsLoading(false);
    onLogout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12161A]/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E8E1D5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FFFFFF] border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#B88554] border border-[#E2D8C7]">
              <ShieldCheck className="w-5 h-5 text-[#9E6E38]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#26221E] tracking-tight">
                Google Sign-In & User Session
              </h3>
              <p className="text-xs text-[#7A7269]">
                Node.js/Express OAuth 2.0 &middot; Mongoose User Schema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7269] hover:text-[#26221E] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Authentication Notice</p>
                <p className="mt-0.5 text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Session Active</p>
                <p className="mt-0.5 text-emerald-700">{successNotice}</p>
              </div>
            </div>
          )}

          {/* SIGNED-IN USER VIEW */}
          {currentUser ? (
            <div className="space-y-5">
              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E8E1D5] shadow-xs">
                <div className="flex items-center gap-4">
                  {currentUser.picture ? (
                    <img
                      src={currentUser.picture}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-full border-2 border-[#B88554] shadow-sm object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#EAE2D5] flex items-center justify-center text-[#73532C] border-2 border-[#B88554]">
                      <User className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-[#26221E] truncate">
                        {currentUser.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Authenticated
                      </span>
                    </div>
                    <p className="text-sm text-[#5E5852] truncate">{currentUser.email}</p>
                    <p className="text-[11px] text-[#8C8275] font-mono mt-1 truncate">
                      Google ID: {currentUser.googleId}
                    </p>
                  </div>
                </div>

                {currentUser.createdAt && (
                  <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#7A7269]">
                    <span>Account Created</span>
                    <span className="font-mono">
                      {new Date(currentUser.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* JWT Session Details */}
              <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#E2D8C7] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#4A423A] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#9E6E38]" />
                    Backend JWT Session Token
                  </span>
                  <span className="text-[10px] bg-[#E8DFD0] px-2 py-0.5 rounded text-[#5E5852] font-mono">
                    Bearer Valid
                  </span>
                </div>
                {rawSessionToken && (
                  <div className="font-mono text-[10px] text-[#5E5852] break-all bg-[#FFFFFF]/80 p-2.5 rounded border border-[#E2D8C7] max-h-20 overflow-y-auto">
                    {rawSessionToken}
                  </div>
                )}
                <p className="text-[11px] text-[#7A7269]">
                  Token securely saved in <code className="bg-[#E8DFD0] px-1 rounded">localStorage</code> and verified on authenticated API requests.
                </p>
              </div>

              {/* Logout Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from Session</span>
                </button>

                <button
                  onClick={() => setIsViewingDb(!isViewingDb)}
                  className="py-2.5 px-3.5 rounded-xl border border-[#D5C9B6] hover:bg-[#EAE2D5] text-[#4A423A] font-medium text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="View Database Users"
                >
                  <Database className="w-4 h-4 text-[#9E6E38]" />
                  <span>DB Schema ({dbUsers.length})</span>
                </button>
              </div>
            </div>
          ) : (
            /* NOT SIGNED-IN VIEW */
            <div className="space-y-5">
              <div className="text-center py-2">
                <h4 className="font-serif text-xl font-medium text-[#26221E]">
                  Welcome to Dr. Syed Karishma Sanctuary
                </h4>
                <p className="text-xs text-[#7A7269] mt-1 max-w-sm mx-auto">
                  Sign in securely with Google OAuth 2.0 to sync your healing prescriptions, 1-on-1 consultations, and therapeutic progress.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E8E1D5] shadow-xs flex flex-col items-center justify-center space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7269]">
                  Official Google Sign-In (OAuth 2.0)
                </p>

                <div className="flex justify-center w-full min-h-[44px]">
                  <GoogleLogin
                    onSuccess={handleGoogleCredentialResponse}
                    onError={() => {
                      setErrorMessage('Google Sign-In popup closed or failed to initialize.');
                    }}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    shape="pill"
                    text="signin_with"
                    width="280"
                  />
                </div>

                <p className="text-[11px] text-[#8C8275] text-center max-w-xs">
                  Extracts Google ID token securely & verifies on backend via <code className="font-mono text-[#9E6E38]">google-auth-library</code>.
                </p>
              </div>

              {/* Quick Dev/Preview Verification Section */}
              <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#E2D8C7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4A423A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B88554]" />
                    Instant Sandbox / Preview Sign-In
                  </span>
                  <span className="text-[10px] bg-[#E8DFD0] px-1.5 py-0.5 rounded text-[#5E5852]">
                    Full Verification Pipeline
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7269]">
                  Trigger the exact backend flow (Token &rarr; POST /api/auth/google &rarr; Mongoose User Schema record &rarr; JWT token &rarr; UI State):
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulatedGoogleSignIn('ashlan')}
                    disabled={isLoading}
                    className="p-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F9F6F0] border border-[#D5C9B6] text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                        alt="Ashlan"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-[#26221E] group-hover:text-[#B88554]">
                        Ashlan Syed
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7A7269] mt-1 truncate">ashlansyed28@gmail.com</p>
                  </button>

                  <button
                    onClick={() => handleSimulatedGoogleSignIn('guest')}
                    disabled={isLoading}
                    className="p-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F9F6F0] border border-[#D5C9B6] text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EAE2D5] flex items-center justify-center text-[#73532C] text-[10px] font-bold">
                        MS
                      </div>
                      <span className="text-xs font-semibold text-[#26221E] group-hover:text-[#B88554]">
                        Mindful Seeker
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7A7269] mt-1 truncate">mindful.seeker@sanctuary.com</p>
                  </button>
                </div>
              </div>

              {/* Client ID Configuration Note */}
              <div className="text-[11px] text-[#7A7269] bg-[#FFFFFF] p-3 rounded-xl border border-[#E8E1D5] flex items-center justify-between">
                <span>
                  <strong className="text-[#4A423A]">VITE_GOOGLE_CLIENT_ID:</strong>{' '}
                  {isCustomClientIdSet ? 'Configured in .env' : 'Using Demo Client ID'}
                </span>
                <button
                  onClick={() => setIsViewingDb(!isViewingDb)}
                  className="text-[#9E6E38] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Database className="w-3 h-3" />
                  <span>View Users DB ({dbUsers.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* DATABASE RECORDS DRAWER */}
          {isViewingDb && (
            <div className="mt-4 p-4 bg-[#FFFFFF] rounded-xl border border-[#E8E1D5] space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-[#26221E] flex items-center gap-1.5 uppercase tracking-wide">
                  <Database className="w-3.5 h-3.5 text-[#B88554]" />
                  Database User Schema Records ({dbUsers.length})
                </h5>
                <button
                  onClick={fetchDatabaseUsers}
                  className="text-xs text-[#7A7269] hover:text-[#26221E] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {dbUsers.length === 0 ? (
                <p className="text-xs text-[#7A7269] italic">
                  No users recorded yet. Sign in above to create the first User document.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {dbUsers.map((u, i) => (
                    <div
                      key={u.googleId || i}
                      className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E1D5] text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {u.picture ? (
                          <img
                            src={u.picture}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#EAE2D5] shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="font-semibold text-[#26221E] truncate">{u.name}</p>
                          <p className="text-[10px] text-[#7A7269] truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono text-[#8C8275] block">
                          ID: {u.googleId.slice(0, 10)}...
                        </span>
                        {u.createdAt && (
                          <span className="text-[9px] text-[#8C8275]">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FFFFFF] border-t border-[#E8E1D5] flex items-center justify-between text-xs text-[#7A7269]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Backend Auth API: <code className="text-[#9E6E38] font-mono">/api/auth/google</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#4A423A] font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
