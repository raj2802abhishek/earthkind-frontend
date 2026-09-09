import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MessageSquare,
  X,
  Send,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw
} from "lucide-react";

function LiveChatWidget() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // Get logged-in user if available
  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  })();

  const initialEmail =
    localStorage.getItem("user_contact_email") || loggedInUser?.email || "";
  const initialName =
    localStorage.getItem("user_contact_name") ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    (loggedInUser?.email ? loggedInUser.email.split("@")[0] : "");

  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [userName, setUserName] = useState(initialName);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Form fields for new chat start
  const [initialForm, setInitialForm] = useState({
    name: userName || "",
    email: userEmail || "",
    message: ""
  });

  const chatEndRef = useRef(null);

  const getApiBase = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.")) {
        return `${window.location.protocol}//${hostname}:5000`;
      }
    }
    return "http://localhost:5000";
  };
  const API_BASE = getApiBase();

  // Sync user profile if user logs in / out
  useEffect(() => {
    const handleUserChanged = () => {
      try {
        const u = JSON.parse(localStorage.getItem("user"));
        if (u?.email) {
          setUserEmail(u.email);
          setUserName(u.name || u.fullName || u.email.split("@")[0]);
        }
      } catch (e) {}
    };

    window.addEventListener("userChanged", handleUserChanged);
    return () => window.removeEventListener("userChanged", handleUserChanged);
  }, []);

  // Real-time polling every 3 seconds for Customer
  useEffect(() => {
    if (userEmail) {
      fetchUserMessages(false);
      const interval = setInterval(() => {
        fetchUserMessages(false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const fetchUserMessages = async (showLoader = false) => {
    if (!userEmail) return;
    try {
      if (showLoader) setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/contact/user-messages?email=${encodeURIComponent(
          userEmail
        )}`
      );
      if (res.data && res.data.success) {
        const fetched = res.data.data;
        setMessages(fetched);

        // Calculate unread admin replies if closed
        if (!isOpen) {
          let count = 0;
          fetched.forEach((thread) => {
            if (thread.replies) {
              const lastReply = thread.replies[thread.replies.length - 1];
              if (lastReply && lastReply.sender === "admin") {
                count++;
              }
            }
          });
          setUnreadCount(count);
        } else {
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching live support messages:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!initialForm.name || !initialForm.email || !initialForm.message) {
      toast.error("Please fill in Name, Email, and Message");
      return;
    }

    try {
      setSending(true);
      const res = await axios.post(`${API_BASE}/api/contact`, {
        name: initialForm.name,
        email: initialForm.email,
        subject: "Live Chat Inquiry",
        message: initialForm.message
      });

      if (res.data && res.data.success) {
        toast.success("Message sent to Earthkind Support! 🌿");
        localStorage.setItem("user_contact_email", initialForm.email);
        localStorage.setItem("user_contact_name", initialForm.name);
        setUserEmail(initialForm.email);
        setUserName(initialForm.name);
        fetchUserMessages(true);
      }
    } catch (error) {
      toast.error("Failed to send message. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || messages.length === 0) return;

    // Use latest message thread
    const latestThread = messages[0];

    try {
      setSending(true);
      const res = await axios.post(
        `${API_BASE}/api/contact/${latestThread._id}/reply`,
        {
          sender: "user",
          senderName: userName || "Customer",
          text: newMessage.trim()
        }
      );

      if (res.data && res.data.success) {
        setNewMessage("");
        fetchUserMessages(false);
      }
    } catch (error) {
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="live-chat-widget-root">
      {/* FLOATING TOGGLE BUTTON */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0);
        }}
        className="live-chat-toggle-btn"
        title="Chat with Earthkind Support"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageSquare size={24} />
            {unreadCount > 0 && (
              <span className="live-chat-badge">{unreadCount}</span>
            )}
            <span className="live-chat-pulse-dot" />
          </>
        )}
      </button>

      {/* FLOATING CHAT WINDOW */}
      {isOpen && (
        <div className="live-chat-window">
          {/* HEADER */}
          <div className="live-chat-header">
            <div className="live-chat-header-info">
              <div className="avatar-circle">🌿</div>
              <div>
                <h4>Earthkind Concierge</h4>
                <p className="online-status">
                  <span className="green-dot" /> Active Live Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          {/* BODY */}
          <div className="live-chat-body">
            {!userEmail ? (
              /* START CHAT FORM */
              <form onSubmit={handleStartChat} className="live-chat-start-form">
                <div className="chat-welcome-banner">
                  <Sparkles size={18} style={{ color: "#d8ef7f" }} />
                  <p>Welcome! How can our wellness experts assist you today?</p>
                </div>

                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={initialForm.name}
                    onChange={(e) =>
                      setInitialForm({ ...initialForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={initialForm.email}
                    onChange={(e) =>
                      setInitialForm({ ...initialForm, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Inquiry *</label>
                  <textarea
                    rows={3}
                    placeholder="Ask about products, orders, or custom advice..."
                    value={initialForm.message}
                    onChange={(e) =>
                      setInitialForm({
                        ...initialForm,
                        message: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="start-chat-submit-btn"
                >
                  <Send size={16} /> {sending ? "Connecting..." : "Start Live Chat"}
                </button>
              </form>
            ) : (
              /* ACTIVE MESSAGES VIEW */
              <div className="live-chat-history-container">
                <div className="user-email-bar">
                  <span>Chatting as: <strong>{userEmail}</strong></span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user_contact_email");
                      setUserEmail("");
                      setMessages([]);
                    }}
                    className="change-email-btn"
                  >
                    Switch
                  </button>
                </div>

                {loading ? (
                  <div className="chat-loading">
                    <RefreshCw size={20} className="spin-icon" /> Loading support history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty">
                    No active messages found. Send your first message below!
                  </div>
                ) : (
                  <div className="chat-messages-flow">
                    {messages.map((thread) => (
                      <div key={thread._id} className="thread-block">
                        {/* ORIGINAL QUESTION */}
                        <div className="widget-bubble user-bubble">
                          <div className="widget-bubble-meta">
                            <span>You</span>
                            <span>{new Date(thread.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>{thread.message}</div>
                        </div>

                        {/* ADMIN REPLIES */}
                        {thread.replies &&
                          thread.replies.map((reply, rIdx) => {
                            const isAdmin = reply.sender === "admin";
                            return (
                              <div
                                key={rIdx}
                                className={`widget-bubble ${
                                  isAdmin ? "admin-bubble" : "user-bubble"
                                }`}
                              >
                                <div className="widget-bubble-meta">
                                  <span>
                                    {isAdmin ? (
                                      <>
                                        <ShieldCheck size={12} /> {reply.senderName || "Earthkind Support"}
                                      </>
                                    ) : (
                                      "You"
                                    )}
                                  </span>
                                  <span>
                                    {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <div>{reply.text}</div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {/* BOTTOM INPUT */}
                <form onSubmit={handleSendReply} className="widget-chat-input-form">
                  <input
                    type="text"
                    placeholder="Type your reply to Earthkind..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="widget-send-btn"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveChatWidget;
