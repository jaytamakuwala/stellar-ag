import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Testimonials.css";
import user1 from "@/assets/Images/user1.png";
import user2 from "@/assets/Images/user2.png";
import user3 from "@/assets/Images/user3.png";

const testimonials = [
  {
    name: "Peter Hegedus",
    handle: "@PLHstock",
    avatar: user1,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    date: "15th July 2025, 3:25 PM",
    source: "twitter",
  },
  {
    name: "John Doe",
    handle: "@johndoe",
    avatar: user2,
    text: "It has survived not only five centuries, but also the leap into electronic typesetting.",
    date: "16th July 2025, 5:45 PM",
    source: "google",
  },
  {
    name: "Jane Smith",
    handle: "@janesmith",
    avatar: user3,
    text: "Remaining essentially unchanged, it was popularised in the 1960s with the release of Letraset sheets.",
    date: "17th July 2025, 2:10 PM",
    source: "twitter",
  },
  {
    name: "Alice Brown",
    handle: "@aliceb",
    avatar: user1,
    text: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    date: "18th July 2025, 7:00 PM",
    source: "google",
  },
  {
    name: "Bob Johnson",
    handle: "@bobj",
    avatar: user2,
    text: "It has roots in a piece of classical Latin literature from 45 BC.",
    date: "19th July 2025, 12:30 PM",
    source: "twitter",
  },
];

const CARD_WIDTH = 490;

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-heading">From our community</h2>
      <div className="testimonials-subheading">
        <span>See what our customers are saying</span>
        <span className="arrow">➜</span>
      </div>

      <div className="testimonials-carousel">
        <motion.div
          className="testimonials-track"
          animate={{ x: -index * CARD_WIDTH }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-header">
                <div className="user-info">
                  <img src={t.avatar} alt={t.name} className="avatar" />
                  <div className="user-text">
                    <span className="name">{t.name}</span>
                    <span className="handle">{t.handle}</span>
                  </div>
                </div>

                {/* Source icons instead of plain text */}
                <div className="source">
                  {t.source === "twitter" && (
                    <FaTwitter size={20} color="#1DA1F2" />
                  )}
                  {t.source === "google" && <FcGoogle size={20} />}
                </div>
              </div>

              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-date">{t.date}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
