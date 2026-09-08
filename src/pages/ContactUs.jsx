import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiMail,
  FiPhoneCall,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiCheckCircle,
  FiSend,
  FiChevronDown,
  FiHelpCircle,
  FiCopy,
  FiZap,
  FiShield,
  FiTruck,
  FiArrowRight
} from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaPinterestP,
  FaYoutube,
  FaLeaf
} from "react-icons/fa";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const topics = [
    { id: "General Inquiry", label: "🌿 General Inquiry" },
    { id: "Order Status & Shipping", label: "📦 Order Status & Shipping" },
    { id: "Product Guidance", label: "🌱 Product Guidance" },
    { id: "Bulk / Wholesale Inquiry", label: "💼 Bulk / Wholesale" },
    { id: "Feedback & Suggestions", label: "💡 Feedback" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTopicSelect = (topicId) => {
    setFormData({ ...formData, subject: topicId });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("support@earthkindnaturals.com");
    toast.success("Email copied to clipboard!", {
      style: {
        borderRadius: "14px",
        background: "#163923",
        color: "#fff",
        fontSize: "14px",
      }
    });
  };

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("user_contact_email") || ""
  );
  const [myMessages, setMyMessages] = useState([]);
  const [loadingMyMessages, setLoadingMyMessages] = useState(false);
  const [userReplyText, setUserReplyText] = useState({});
  const [sendingUserReply, setSendingUserReply] = useState(false);

  React.useEffect(() => {
    if (userEmail) {
      fetchUserMessages(userEmail, true);
      const interval = setInterval(() => {
        fetchUserMessages(userEmail, false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  const fetchUserMessages = async (emailToFetch, showSpinner = false) => {
    if (!emailToFetch) return;
    try {
      if (showSpinner) setLoadingMyMessages(true);
      const API_BASE = window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : (import.meta.env.VITE_API_URL || "http://localhost:5000");

      const res = await axios.get(
        `${API_BASE}/api/contact/user-messages?email=${encodeURIComponent(emailToFetch)}`
      );

      if (res.data && res.data.success) {
        setMyMessages(res.data.data);
      }
    } catch (err) {
      if (showSpinner) console.error("Error fetching user messages:", err);
    } finally {
      if (showSpinner) setLoadingMyMessages(false);
    }
  };

  const handleUserReply = async (msgId) => {
    const replyTxt = userReplyText[msgId];
    if (!replyTxt || !replyTxt.trim()) {
      toast.error("Please enter a reply text.");
      return;
    }

    try {
      setSendingUserReply(true);
      const API_BASE = window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : (import.meta.env.VITE_API_URL || "http://localhost:5000");

      const res = await axios.post(`${API_BASE}/api/contact/${msgId}/reply`, {
        sender: "user",
        text: replyTxt.trim()
      });

      if (res.data && res.data.success) {
        toast.success("Reply sent to Earthkind Support! 🌿");
        setUserReplyText({ ...userReplyText, [msgId]: "" });
        fetchUserMessages(userEmail);
      }
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setSendingUserReply(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const API_BASE = window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : (import.meta.env.VITE_API_URL || "http://localhost:5000");

      const res = await axios.post(`${API_BASE}/api/contact`, formData);

      if (res.data.success) {
        toast.success("Thank you! Your message has been sent and saved to our database 🌿", {
          style: {
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1f4d2e, #163822)",
            color: "#fff",
            padding: "16px 22px",
            fontSize: "15px",
            fontWeight: "600",
            boxShadow: "0 14px 35px rgba(0,0,0,0.22)"
          },
          iconTheme: {
            primary: "#d8ef7f",
            secondary: "#1f4d2e"
          }
        });

        localStorage.setItem("user_contact_email", formData.email);
        setUserEmail(formData.email);
        fetchUserMessages(formData.email);

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message || "Failed to save message. Please try again.",
        {
          style: {
            borderRadius: "14px",
            background: "#3d1414",
            color: "#fff",
            padding: "14px 18px",
          }
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How fast will I receive a reply to my query?",
      a: "Our dedicated support team reviews inquiries in real-time. You can typically expect a response within 2 to 4 business hours during our operating time."
    },
    {
      q: "How can I track my Earthkind order status?",
      a: "You can track your live shipment anytime from the 'My Orders' section in your account. You will also receive WhatsApp & email updates with tracking links as soon as your parcel dispatches."
    },
    {
      q: "Are Earthkind Naturals products 100% pure and lab-tested?",
      a: "Yes, absolutely! All our herbal powders, seeds, and wellness infusions are 100% natural, ethically sourced, pesticide-free, and thoroughly lab-tested for maximum potency."
    },
    {
      q: "Do you offer bulk or wholesale pricing for business partners?",
      a: "We welcome bulk inquiries for wellness centers, retail stores, cafes, and corporate gifting. Simply select 'Bulk / Wholesale' in the contact form or drop us an email."
    }
  ];

  return (
    <div className="contact-page-shell">
      {/* LUXURY HERO BANNER */}
      <div className="contact-hero">
        <div className="contact-hero-backdrop-glow" />
        <div className="contact-hero-content">
          <div className="contact-badge">
            <FaLeaf style={{ color: "#d8ef7f", marginRight: "8px", fontSize: "14px" }} />
            EARTHKIND CONCIERGE & CARE
          </div>

          <h1 className="contact-hero-title">
            We Are Here For Your <br />
            <span style={{ color: "#d8ef7f", fontStyle: "italic" }}>Wellness Journey</span>
          </h1>

          <p className="contact-hero-subtitle">
            Have questions about our pure herbal powders, premium seeds, or need delivery guidance?
            Our herbal experts and care team are delighted to assist you.
          </p>

          {/* HERO HIGHLIGHTS STATS BAR */}
          <div className="contact-hero-stats">
            <div className="contact-stat-item">
              <FiZap className="contact-stat-icon" />
              <div>
                <strong>&lt; 2 Hours Response</strong>
                <span>Rapid Support Guaranteed</span>
              </div>
            </div>

            <div className="contact-stat-divider" />

            <div className="contact-stat-item">
              <FiShield className="contact-stat-icon" />
              <div>
                <strong>100% Herbal Advice</strong>
                <span>Expert Guidance</span>
              </div>
            </div>

            <div className="contact-stat-divider" />

            <div className="contact-stat-item">
              <FiTruck className="contact-stat-icon" />
              <div>
                <strong>Pan-India Shipping</strong>
                <span>Live Order Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container contact-main-container">
        {/* TOP INTERACTIVE CONTACT CARDS GRID */}
        <div className="contact-cards-grid">
          {/* EMAIL CARD */}
          <div className="contact-info-card">
            <div className="contact-card-icon-box">
              <FiMail className="contact-card-icon" />
            </div>
            <h3>Email Support</h3>
            <p>Send your queries or detailed product questions anytime.</p>
            <div className="contact-action-wrapper">
              <a href="mailto:support@earthkindnaturals.com" className="contact-card-link">
                support@earthkindnaturals.com
              </a>
              <button onClick={copyEmail} className="contact-copy-btn" title="Copy Email">
                <FiCopy />
              </button>
            </div>
          </div>

          {/* CALL & WHATSAPP CARD */}
          <div className="contact-info-card">
            <div className="contact-card-icon-box">
              <FiPhoneCall className="contact-card-icon" />
            </div>
            <h3>Call or WhatsApp</h3>
            <p>Instant guidance and order support from our team.</p>
            <div className="contact-action-wrapper">
              <a href="tel:+919027186252" className="contact-card-link">
                +91 9027186252
              </a>
              <a
                href="https://wa.me/919027186252?text=Hello%20Earthkind%20Team!%20I%20have%20a%20query."
                target="_blank"
                rel="noreferrer"
                className="contact-whatsapp-btn"
              >
                <FaWhatsapp style={{ marginRight: "5px" }} /> Chat
              </a>
            </div>
          </div>

          {/* HEADQUARTERS CARD */}
          <div className="contact-info-card">
            <div className="contact-card-icon-box">
              <FiMapPin className="contact-card-icon" />
            </div>
            <h3>Headquarters</h3>
            <p>Earthkind Naturals Herbal Care & Experience Center</p>
            <span className="contact-card-text">India</span>
          </div>

          {/* SUPPORT HOURS CARD */}
          <div className="contact-info-card">
            <div className="contact-card-icon-box">
              <FiClock className="contact-card-icon" />
            </div>
            <h3>Operating Hours</h3>
            <p>Mon - Sat: 9:00 AM - 7:00 PM IST</p>
            <div className="contact-status-badge">
              <span className="status-pulse-dot" />
              Live Support Active
            </div>
          </div>
        </div>

        {/* MAIN SECTION: FORM + SIDEBAR */}
        <div className="contact-grid">
          {/* FORM CARD */}
          <div className="contact-form-card">
            <div className="contact-form-header">
              <div className="contact-form-badge">
                <FiMessageSquare style={{ marginRight: "6px" }} /> GET IN TOUCH
              </div>
              <h2 className="contact-section-title">
                Send Us A Message
              </h2>
              <p className="contact-form-desc">
                Select your topic below and share your message. We typically respond within a few hours.
              </p>
            </div>

            {/* TOPIC SELECTOR BADGES */}
            <div className="contact-topic-selector">
              <span className="topic-selector-label">Select Inquiry Topic:</span>
              <div className="topic-pills-row">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`topic-pill ${formData.subject === t.id ? "active" : ""}`}
                    onClick={() => handleTopicSelect(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-field-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Ananya Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-field-group">
                  <label htmlFor="subject">Selected Topic</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="contact-field-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="How can our herbal wellness team assist you today?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading-state">
                    <span className="btn-spinner" /> Sending Message...
                  </span>
                ) : (
                  <>
                    Send Message <FiSend style={{ marginLeft: "8px" }} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* SIDEBAR DETAILS */}
          <div className="contact-sidebar">
            {/* BUSINESS HOURS BOX */}
            <div className="contact-sidebar-box">
              <div className="contact-sidebar-title">
                <FiClock style={{ color: "#234d2c", fontSize: "22px" }} />
                Support Schedule
              </div>
              <ul className="contact-hours-list">
                <li>
                  <span>Monday - Friday</span>
                  <strong>9:00 AM - 7:00 PM</strong>
                </li>
                <li>
                  <span>Saturday</span>
                  <strong>10:00 AM - 5:00 PM</strong>
                </li>
                <li>
                  <span>Sunday</span>
                  <strong style={{ color: "#234d2c" }}>Closed (Rest & Wellness)</strong>
                </li>
              </ul>
            </div>

            {/* WHY CHOOSE US PROMISES BOX */}
            <div className="contact-sidebar-box accent">
              <h4 className="contact-promises-title">The Earthkind Guarantee</h4>
              <div className="contact-promise-item">
                <FiCheckCircle className="promise-icon" />
                <div>
                  <strong>100% Pure & Lab Tested</strong>
                  <p>Clean ingredients with zero synthetic chemicals or fillers.</p>
                </div>
              </div>
              <div className="contact-promise-item">
                <FiCheckCircle className="promise-icon" />
                <div>
                  <strong>Fast Resolution Time</strong>
                  <p>Average customer response time under 2-4 hours.</p>
                </div>
              </div>
              <div className="contact-promise-item">
                <FiCheckCircle className="promise-icon" />
                <div>
                  <strong>Satisfied Living Guarantee</strong>
                  <p>Hassle-free replacement or assistance for all orders.</p>
                </div>
              </div>
            </div>

            {/* SOCIAL CONNECT BOX */}
            <div className="contact-sidebar-box">
              <div className="contact-sidebar-title">Join Our Community</div>
              <p style={{ fontSize: "13.5px", color: "rgba(22,57,35,0.78)", marginBottom: "16px", lineHeight: "1.5" }}>
                Follow Earthkind Naturals for daily wellness tips, herbal recipes, and exclusive community offers.
              </p>
              <div className="contact-social-row">
                <a href="https://instagram.com/earthkind_naturals" target="_blank" rel="noreferrer" className="contact-social-icon instagram" title="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://facebook.com/earthkindnaturals" target="_blank" rel="noreferrer" className="contact-social-icon facebook" title="Facebook">
                  <FaFacebookF />
                </a>
                <a href="https://wa.me/919027186252" target="_blank" rel="noreferrer" className="contact-social-icon whatsapp" title="WhatsApp">
                  <FaWhatsapp />
                </a>
                <a href="https://pinterest.com/earthkindnaturals" target="_blank" rel="noreferrer" className="contact-social-icon pinterest" title="Pinterest">
                  <FaPinterestP />
                </a>
                <a href="https://youtube.com/@earthkindnaturals" target="_blank" rel="noreferrer" className="contact-social-icon youtube" title="YouTube">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE INQUIRIES & LIVE SUPPORT REPLIES SECTION */}
        {userEmail && (
          <div style={{ margin: "50px 0 30px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span className="contact-badge centered">
                <FiMessageSquare style={{ marginRight: "6px", color: "#234d2c" }} />
                LIVE SUPPORT & REPLIES
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "32px", color: "#163923", margin: "8px 0 0" }}>
                My Support Inquiries & Admin Replies
              </h2>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Viewing messages associated with <strong>{userEmail}</strong>
              </p>
            </div>

            {loadingMyMessages ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                Checking for support replies...
              </div>
            ) : myMessages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", background: "#fff", borderRadius: "20px", border: "1px solid #e0e8e0", color: "#666" }}>
                No active inquiries found for this email yet. Send a message above to get started!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {myMessages.map((msg) => (
                  <div
                    key={msg._id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "24px",
                      border: "1px solid #dce8dc",
                      padding: "24px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#234d2c" }}>
                          {msg.subject}
                        </span>
                        <span style={{ fontSize: "12px", color: "#888", marginLeft: "12px" }}>
                          Sent: {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span
                        className={`msg-badge ${
                          msg.status === "New"
                            ? "badge-new"
                            : msg.status === "In Progress"
                            ? "badge-progress"
                            : "badge-resolved"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>

                    {/* ORIGINAL MESSAGE */}
                    <div style={{ background: "#f6f9f6", padding: "14px 18px", borderRadius: "16px", border: "1px solid #e2ece2", marginBottom: "16px" }}>
                      <strong style={{ display: "block", fontSize: "13px", color: "#163923", marginBottom: "4px" }}>
                        Your Question:
                      </strong>
                      <p style={{ margin: 0, fontSize: "14px", color: "#333", lineHeight: 1.5 }}>
                        {msg.message}
                      </p>
                    </div>

                    {/* REPLIES LIST */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                        <strong style={{ fontSize: "13px", color: "#163923" }}>
                          💬 Support Conversation ({msg.replies.length}):
                        </strong>
                        {msg.replies.map((r, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "14px 18px",
                              borderRadius: "16px",
                              background: r.sender === "admin" ? "linear-gradient(135deg, #163923, #255938)" : "#ffffff",
                              color: r.sender === "admin" ? "#ffffff" : "#222",
                              border: r.sender === "admin" ? "1px solid rgba(216, 239, 127, 0.4)" : "1px solid #dce8dc",
                              alignSelf: r.sender === "admin" ? "flex-start" : "flex-end",
                              maxWidth: "85%"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "11px", marginBottom: "4px" }}>
                              <span style={{ fontWeight: "700", color: r.sender === "admin" ? "#d8ef7f" : "#163923" }}>
                                {r.sender === "admin" ? "🌿 Earthkind Support" : "You"}
                              </span>
                              <span style={{ opacity: 0.7 }}>
                                {new Date(r.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.5 }}>
                              {r.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* USER REPLY FORM */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <input
                        type="text"
                        placeholder="Type a reply back to Earthkind support..."
                        value={userReplyText[msg._id] || ""}
                        onChange={(e) =>
                          setUserReplyText({
                            ...userReplyText,
                            [msg._id]: e.target.value
                          })
                        }
                        style={{
                          flex: 1,
                          padding: "10px 16px",
                          borderRadius: "12px",
                          border: "1px solid #ccc",
                          fontSize: "13.5px",
                          outline: "none"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleUserReply(msg._id)}
                        disabled={sendingUserReply || !(userReplyText[msg._id] || "").trim()}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "12px",
                          border: "none",
                          background: "#163923",
                          color: "#fff",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ SECTION */}
        <div className="contact-faq-section">
          <div className="contact-faq-header">
            <span className="contact-badge centered">
              <FiHelpCircle style={{ marginRight: "6px", color: "#234d2c" }} />
              QUICK ASSISTANCE
            </span>
            <h2 className="contact-faq-title">Frequently Asked Questions</h2>
          </div>

          <div className="contact-faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`contact-faq-item ${activeFaq === index ? "open" : ""}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="contact-faq-question">
                  <h3>{faq.q}</h3>
                  <FiChevronDown className="faq-arrow-icon" />
                </div>
                {activeFaq === index && (
                  <div className="contact-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
