import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Send,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  ShieldAlert
} from "lucide-react";

function MessagesPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowChatPanel(true);
  };

  const handleBackToList = () => {
    setShowChatPanel(false);
  };

  const chatEndRef = React.useRef(null);

  const API_BASE =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : (import.meta.env.VITE_API_URL || "http://localhost:5000");

  // REAL-TIME AUTO POLLING (Every 3 seconds)
  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false); // silent polling
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedContact?._id]);

  // AUTO SCROLL TO BOTTOM OF CHAT THREAD
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact?.replies?.length, selectedContact?._id]);

  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get(`${API_BASE}/api/contact`);
      if (res.data && res.data.success) {
        const data = res.data.data;
        setMessages(data);

        // Keep active conversation reference in sync
        setSelectedContact((prevSelected) => {
          if (!prevSelected && data.length > 0) return data[0];
          if (prevSelected) {
            const match = data.find((m) => m._id === prevSelected._id);
            return match || prevSelected;
          }
          return null;
        });
      }
    } catch (error) {
      if (showLoading) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load customer messages");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e?.preventDefault();
    if (!selectedContact) return;
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    try {
      setSendingReply(true);
      const res = await axios.post(
        `${API_BASE}/api/contact/${selectedContact._id}/reply`,
        {
          sender: "admin",
          senderName: "Earthkind Support 🌿",
          text: replyText.trim()
        }
      );

      if (res.data && res.data.success) {
        toast.success("Reply sent to customer! 📩");
        setReplyText("");
        // Update local state immediately
        const updatedContact = res.data.data;
        setSelectedContact(updatedContact);
        setMessages((prev) =>
          prev.map((m) => (m._id === updatedContact._id ? updatedContact : m))
        );
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/contact/${contactId}/status`,
        { status: newStatus }
      );

      if (res.data && res.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        const updated = res.data.data;
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(updated);
        }
        setMessages((prev) =>
          prev.map((m) => (m._id === contactId ? updated : m))
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteMessage = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message thread?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${API_BASE}/api/contact/${contactId}`
      );
      if (res.data && res.data.success) {
        toast.success("Message thread deleted 🗑️");
        const remaining = messages.filter((m) => m._id !== contactId);
        setMessages(remaining);
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(remaining[0] || null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return <span className="msg-badge badge-new">New</span>;
      case "In Progress":
        return <span className="msg-badge badge-progress">In Progress</span>;
      case "Resolved":
        return <span className="msg-badge badge-resolved">Resolved</span>;
      default:
        return <span className="msg-badge badge-archived">{status}</span>;
    }
  };

  const quickReplies = [
    "Thank you for contacting Earthkind Naturals! We have received your query and are looking into it.",
    "Your request has been processed successfully. Please let us know if you need anything else!",
    "Our support team is reviewing your order details and will get back to you shortly."
  ];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* 1. HEADER OVERVIEW BANNER */}
      <div
        className="messages-overview-banner"
        style={{
          marginBottom: "32px",
          background: "linear-gradient(135deg, rgba(22, 57, 35, 0.95), rgba(33, 77, 49, 0.9), rgba(46, 106, 69, 0.95))",
          borderRadius: "32px",
          padding: "36px 40px",
          color: "#fff",
          boxShadow: "0 20px 50px rgba(22, 57, 35, 0.22)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.15)"
        }}
      >
        {/* Glow ambient circle */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-80px",
          width: "320px",
          height: "320px",
          background: "radial-gradient(circle, rgba(163, 230, 53, 0.25) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.15)", padding: "6px 16px", borderRadius: "999px", backdropFilter: "blur(10px)", marginBottom: "14px", fontSize: "13px", fontWeight: "600", letterSpacing: "1px" }}>
              <Sparkles size={14} color="#a3e635" /> CUSTOMER COMMUNICATIONS HUB
            </div>
            <h1 className="messages-banner-title" style={{ fontSize: "38px", fontWeight: "800", margin: 0, letterSpacing: "-1px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Customer Support & Chat 💬
            </h1>
            <p className="messages-banner-sub" style={{ margin: "8px 0 0 0", color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", maxWidth: "560px", lineHeight: "1.6" }}>
              Manage incoming contact inquiries, send instant responses to users, and track support ticket statuses.
            </p>
          </div>

          <div className="messages-banner-badge-wrapper" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="messages-banner-badge" style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "16px 24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "right"
            }}>
              <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "600" }}>Total Support Threads</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#a3e635" }}>
                {messages.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI SUMMARY METRIC CARDS */}
      <div
        className="messages-kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "32px"
        }}
      >
        {/* Total Inquiries */}
        <div className="messages-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(22, 57, 35, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="messages-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #163923, #285b37)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(22, 57, 35, 0.2)",
            flexShrink: 0
          }}>
            <MessageSquare size={26} />
          </div>
          <div className="messages-kpi-content" style={{ minWidth: 0 }}>
            <span className="messages-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>Total Inquiries</span>
            <span className="messages-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#163923" }}>{messages.length}</span>
          </div>
        </div>

        {/* New Messages */}
        <div className="messages-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="messages-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #059669, #10b981)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(16, 185, 129, 0.25)",
            flexShrink: 0
          }}>
            <Sparkles size={26} />
          </div>
          <div className="messages-kpi-content" style={{ minWidth: 0 }}>
            <span className="messages-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>New Messages</span>
            <span className="messages-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#059669" }}>
              {messages.filter((m) => m.status === "New").length}
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div className="messages-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(245, 158, 11, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="messages-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(245, 158, 11, 0.25)",
            flexShrink: 0
          }}>
            <Clock size={26} />
          </div>
          <div className="messages-kpi-content" style={{ minWidth: 0 }}>
            <span className="messages-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>In Progress</span>
            <span className="messages-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#d97706" }}>
              {messages.filter((m) => m.status === "In Progress").length}
            </span>
          </div>
        </div>

        {/* Resolved */}
        <div className="messages-kpi-card" style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "22px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(59, 130, 246, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="messages-kpi-icon" style={{
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 8px 18px rgba(59, 130, 246, 0.25)",
            flexShrink: 0
          }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="messages-kpi-content" style={{ minWidth: 0 }}>
            <span className="messages-kpi-title" style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", display: "block" }}>Resolved</span>
            <span className="messages-kpi-value" style={{ fontSize: "26px", fontWeight: "800", color: "#1d4ed8" }}>
              {messages.filter((m) => m.status === "Resolved").length}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MESSAGES LAYOUT GRID */}
      <div className="messages-grid-shell">
        {/* LEFT COLUMN: LIST & SEARCH */}
        <div className={`messages-sidebar-panel ${showChatPanel ? "mobile-hidden" : ""}`}>
          {/* SEARCH & FILTERS */}
          <div className="messages-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="messages-search-input"
            />
          </div>

          <div className="status-filter-pills">
            {["All", "New", "In Progress", "Resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`status-pill ${statusFilter === st ? "active" : ""}`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* LIST OF CONVERSATIONS */}
          <div className="messages-list-wrapper">
            {loading ? (
              <div className="messages-loading">Loading conversations...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="messages-empty">
                No customer messages found.
              </div>
            ) : (
              filteredMessages.map((item) => {
                const isSelected = selectedContact?._id === item._id;
                const hasReplies = item.replies && item.replies.length > 0;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelectContact(item)}
                    className={`message-card-item ${isSelected ? "selected" : ""}`}
                  >
                    <div className="msg-card-top">
                      <span className="user-name">{item.name}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <span className="user-email">{item.email}</span>
                    <h4 className="msg-subject">{item.subject}</h4>
                    <p className="msg-snippet">{item.message}</p>
                    <div className="msg-card-footer">
                      <span className="msg-date">
                        <Clock size={12} style={{ marginRight: "4px" }} />
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      {hasReplies && (
                        <span className="reply-count-tag">
                          💬 {item.replies.length} {item.replies.length === 1 ? "reply" : "replies"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE THREAD & CHAT */}
        <div className={`messages-chat-panel ${showChatPanel ? "mobile-visible" : ""}`}>
          {selectedContact ? (
            <div className="chat-thread-container">
              {/* CHAT HEADER & CUSTOMER DETAILS */}
              <div className="chat-thread-header">
                <button
                  onClick={handleBackToList}
                  className="mobile-back-btn"
                >
                  ← Back
                </button>
                <div className="customer-info-meta">
                  <h3>{selectedContact.name}</h3>
                  <div className="meta-pills-row">
                    <span>
                      <Mail size={14} /> {selectedContact.email}
                    </span>
                    {selectedContact.phone && (
                      <span>
                        <Phone size={14} /> {selectedContact.phone}
                      </span>
                    )}
                  </div>
                  <div className="subject-bar">
                    <strong>Subject:</strong> {selectedContact.subject}
                  </div>
                </div>

                <div className="chat-actions-group">
                  <div className="status-selector-box">
                    <label>Status:</label>
                    <select
                      value={selectedContact.status}
                      onChange={(e) =>
                        handleUpdateStatus(selectedContact._id, e.target.value)
                      }
                      className="status-dropdown"
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(selectedContact._id)}
                    className="delete-thread-btn"
                    title="Delete Thread"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* CONVERSATION HISTORY MESSAGES */}
              <div className="chat-messages-scroll">
                {/* ORIGINAL SUBMISSION */}
                <div className="chat-bubble customer-first-bubble">
                  <div className="bubble-header">
                    <span className="sender-badge user">
                      <User size={13} /> {selectedContact.name} (Customer)
                    </span>
                    <span className="timestamp">
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="bubble-text">{selectedContact.message}</div>
                </div>

                {/* REPLIES THREAD */}
                {selectedContact.replies &&
                  selectedContact.replies.map((reply, idx) => {
                    const isAdmin = reply.sender === "admin";
                    return (
                      <div
                        key={idx}
                        className={`chat-bubble ${
                          isAdmin ? "admin-reply-bubble" : "customer-reply-bubble"
                        }`}
                      >
                        <div className="bubble-header">
                          <span
                            className={`sender-badge ${
                              isAdmin ? "admin" : "user"
                            }`}
                          >
                            {isAdmin ? (
                              <>
                                <ShieldAlert size={13} /> {reply.senderName || "Earthkind Support"}
                              </>
                            ) : (
                              <>
                                <User size={13} /> {reply.senderName || selectedContact.name}
                              </>
                            )}
                          </span>
                          <span className="timestamp">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="bubble-text">{reply.text}</div>
                      </div>
                    );
                  })}
                <div ref={chatEndRef} />
              </div>

              {/* QUICK REPLIES CHIPS */}
              <div className="quick-replies-bar">
                <span className="quick-label">
                  <Sparkles size={13} /> Quick Replies:
                </span>
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReplyText(qr)}
                    className="quick-chip-btn"
                  >
                    {qr.length > 35 ? qr.substring(0, 35) + "..." : qr}
                  </button>
                ))}
              </div>

              {/* REPLY FORM INPUT */}
              <form onSubmit={handleSendReply} className="chat-input-form">
                <textarea
                  rows={3}
                  placeholder={`Reply to ${selectedContact.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="chat-textarea"
                />

                <div className="chat-form-bottom">
                  <span className="keyboard-tip">Press Send Reply to notify customer</span>
                  <button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="send-reply-btn"
                  >
                    <Send size={16} /> {sendingReply ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="no-chat-selected">
              <MessageSquare size={48} style={{ color: "#a5b4a3", marginBottom: "12px" }} />
              <h3>No Conversation Selected</h3>
              <p>Select a message from the left menu to view details and send replies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPanel;
