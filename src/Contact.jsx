import React from 'react';

function Contact() {
  return (
    <section id="contact" className="contact-section">
      {/* Main heading */}
      <h1>Contact Us</h1>

      {/* Intro paragraph */}
      <p>
        We’d love to hear from you! Whether you have questions, suggestions, or collaboration ideas — 
        the <strong>AI Insight Journal</strong> team is always open to communication.
      </p>

      {/* Subheading: General inquiries */}
      <h2>General Inquiries</h2>
      <p>
        For general questions about our publications, content, or partnerships, 
        please reach out via email:
      </p>
      <p>
        📧 <a href="mailto:info@ai-insight-journal.com">info@ai-insight-journal.com</a>
      </p>

      {/* Subheading: Editorial contact */}
      <h2>Editorial Team</h2>
      <p>
        Have a story, research update, or expert opinion to share?  
        Contact our editorial board at:
      </p>
      <p>
        📰 <a href="mailto:editorial@ai-insight-journal.com">editorial@ai-insight-journal.com</a>
      </p>

      {/* Subheading: Partnerships */}
      <h2>Partnerships and Media</h2>
      <p>
        We collaborate with academic institutions, companies, and media partners interested in the development of AI.  
        Let’s explore how we can work together:
      </p>
      <p>
        🤝 <a href="mailto:partners@ai-insight-journal.com">partners@ai-insight-journal.com</a>
      </p>

      {/* Subheading: Social Media */}
      <h2>Follow Us</h2>
      <p>
        Stay connected and follow our latest insights and updates through social media:
      </p>
      <ul>
        <li><a href="https://twitter.com/AIInsightJournal" target="_blank" rel="noopener noreferrer">Twitter</a></li>
        <li><a href="https://linkedin.com/company/ai-insight-journal" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="https://t.me/AIInsightJournal" target="_blank" rel="noopener noreferrer">Telegram</a></li>
      </ul>

      {/* Optional: Contact form placeholder */}
      <h2>Send Us a Message</h2>
      <form action="/contact-submit" method="post" className="contact-form">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your name" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Your email" required />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="Write your message..." required></textarea>

        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </section>
  );
}

export default Contact;

