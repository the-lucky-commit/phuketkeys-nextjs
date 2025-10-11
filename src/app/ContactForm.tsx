'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const notification = toast.loading('Sending your message...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, { cache: 'no-store' });
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (response.ok) {
        toast.success('Message sent successfully!', { id: notification });
        // เคลียร์ฟอร์ม
        setName(''); setEmail(''); setPhone(''); setMessage('');
      } else {
        toast.error('Failed to send message.', { id: notification });
      }
    } catch (error) {
      toast.error('An error occurred.', { id: notification });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>Contact Us</h2>
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="tel" placeholder="Your Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
            <textarea placeholder="Your Message" rows={5} value={message} onChange={e => setMessage(e.target.value)} required></textarea>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p><i className="fas fa-map-marker-alt"></i> 123 Bangla Road, Patong, Phuket 83150</p>
            <p><i className="fas fa-phone-alt"></i> +66 (0) 76 123 456</p>
            <p><i className="fas fa-envelope"></i> info@phuketkeys.com</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-line"></i></a>
            </div>
          </div>
        </div>
        {/* ... ส่วนของแผนที่ ... */}
      </div>
    </section>
  );
}