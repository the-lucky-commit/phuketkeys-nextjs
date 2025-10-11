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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, { // <-- แก้ไข URL ตรงนี้
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      }); // <-- วงเล็บปิดที่ถูกต้องอยู่ตรงนี้

      if (response.ok) {
        toast.success('Message sent successfully!', { id: notification });
        // เคลียร์ฟอร์ม
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
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
        <div className="map-container">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.988353102195!2d98.2959805147781!3d7.89643499429789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30503a985b3a3ab9%3A0xb3e64239829a738c!2sBangla%20Road!5e0!3m2!1sen!2sth!4v1633948332156!5m2!1sen!2sth" width="100%" height="450" style={{ border: 0 }} allowFullScreen={false} loading="lazy"></iframe>
        </div>
      </div>
    </section>
  );
}