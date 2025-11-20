import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/about.css";

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const visibilityMapRef = useRef({});

  const slides = useMemo(
    () => [
      {
        id: "intro",
        title: "About AI Insight Journal (AIJ)",
        element: (
          <div className="about-intro">
            <h1>About AI Insight Journal (AIJ)</h1>
            <p>
              Welcome to <strong>AI Insight Journal (AIJ)</strong> — your leading source of knowledge in the world of artificial intelligence. 
              We explore the latest research, innovations, and their impact across every aspect of life — from science and technology to business and society.
            </p>
          </div>
        ),
      },
      {
        id: "mission",
        title: "Our Mission",
        element: (
          <div className="about-mission-vision">
            <div className="about-card">
              <h2>Our Mission</h2>
              <p>
                Our mission is to make artificial intelligence knowledge <em>accessible and understandable</em> for everyone. 
                We aim to translate complex AI concepts into clear, engaging insights that inspire learning and innovation.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "vision",
        title: "Our Vision",
        element: (
          <div className="about-mission-vision">
            <div className="about-card">
              <h2>Our Vision</h2>
              <p>
                We see AIJ as a space where researchers, engineers, and business leaders can 
                share ideas, build collaborations, and grow an innovative community — both in Ukraine and globally.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "goals",
        title: "Strategic Goals",
        element: (
          <div className="about-values">
            <h2>Strategic Goals</h2>
            <ul>
              <li>Deliver up-to-date news and research on AI technologies.</li>
              <li>Publish in-depth analytical materials for a deep understanding of the field.</li>
              <li>Encourage community building through discussions, comments, and workshops.</li>
              <li>Foster partnerships between academia and industry experts.</li>
              <li>Position AIJ as a trusted source of expert insights in artificial intelligence.</li>
            </ul>
          </div>
        ),
      },
      {
        id: "unique",
        title: "What Makes Us Different",
        element: (
          <div className="about-unique">
            <h2>What Makes Us Different</h2>
            <p>
              Unlike typical tech platforms, <strong>AIJ</strong> combines the perspectives of Ukrainian experts and international professionals, 
              offering a <em>unique, global view</em> on AI development.
            </p>
            <h2>Languages</h2>
            <p>
              We primarily publish in <strong>English</strong> to reach a global audience while also offering 
              <strong>Ukrainian</strong> versions to support and grow the national AI community.
            </p>
          </div>
        ),
      },
      {
        id: "offerings",
        title: "What We Offer",
        element: (
          <div className="about-offerings">
            <h2>What We Offer</h2>
            <p>
              <strong>AI Insight Journal (AIJ)</strong> is more than just a news platform — 
              it’s a comprehensive hub for understanding and applying artificial intelligence in research, technology, and business.
            </p>
            <div className="capabilities-grid">
              <article className="capability-item">
                <h3>AI News & Research Feed</h3>
                <p>Stay up to date with the latest developments in AI — from academic discoveries to real-world innovations. Our editorial team curates verified, relevant, and insightful content daily.</p>
              </article>
              <article className="capability-item">
                <h3>Deep Analysis & Reports</h3>
                <p>Explore in-depth analytical materials, model comparisons, and industry reports that explain how artificial intelligence shapes science, business, and society.</p>
              </article>
              <article className="capability-item">
                <h3>Practical Guides & Tutorials</h3>
                <p>Learn new technologies hands-on. From machine learning frameworks to ethical AI deployment — our guides help both beginners and professionals grow their expertise.</p>
              </article>
              <article className="capability-item">
                <h3>Community & Expert Profiles</h3>
                <p>Connect with researchers, engineers, and business leaders in AI. Our author pages and comment sections encourage dialogue and collaboration.</p>
              </article>
              <article className="capability-item">
                <h3>AI for Business Insights</h3>
                <p>Understand how AI transforms industries. Get access to trend reports, case studies, and ethical frameworks tailored for business leaders.</p>
              </article>
              <article className="capability-item">
                <h3>Subscriptions & Personalization</h3>
                <p>Subscribe to our email digest or customize your AIJ feed based on topics and authors you follow. Always stay informed about what matters most to you.</p>
              </article>
            </div>
          </div>
        ),
      },
      {
        id: "cta",
        title: "Join the Future of AI",
        element: (
          <div className="about-cta">
            <h2>Join the Future of AI</h2>
            <p>
              We invite all AI enthusiasts, researchers, and professionals to join our platform. 
              Together, we can shape the future of artificial intelligence by sharing high-quality knowledge and driving innovation.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        ),
      },
    ],
    []
  );

  // Observe visibility of slides and set the most visible as active for fading
  useEffect(() => {
    if (!slideRefs.current) return;
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };
    const handler = (entries) => {
      for (const entry of entries) {
        const idx = Number(entry.target.getAttribute("data-index"));
        visibilityMapRef.current[idx] = entry.intersectionRatio;
      }
      // pick the index with highest ratio
      let bestIdx = 0;
      let bestRatio = -1;
      for (let i = 0; i < slides.length; i++) {
        const r = visibilityMapRef.current[i] ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          bestIdx = i;
        }
      }
      setActiveIndex(bestIdx);
    };
    const observer = new IntersectionObserver(handler, options);
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => {
      slideRefs.current.forEach((el) => el && observer.unobserve(el));
      observer.disconnect();
    };
  }, [slides.length]);

  return (
    <div
      ref={containerRef}
      className="about-container"
      role="region"
      aria-label="About sections, scroll to view"
    >
      <div className="about-stage" aria-live="polite" aria-atomic="true">
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            id={slide.id}
            data-index={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className={`about-slide ${index === activeIndex ? "is-visible" : ""}`}
            aria-hidden={index !== activeIndex}
          >
            <div className="about-content">
              {slide.element}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* removed reduced-motion paging logic; we respect user scroll by default */
