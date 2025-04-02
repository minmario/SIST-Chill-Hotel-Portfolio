"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import styles from "./customer-service.module.css"

const faqs = [
  {
    id: 1,
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in time is 3:00 PM and check-out time is 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability and additional charges may apply.",
  },
  {
    id: 2,
    question: "Is breakfast included in the room rate?",
    answer:
      "Breakfast inclusion depends on the room package you book. Some of our room rates include breakfast, while others do not. Please check the details of your reservation or contact our customer service for more information.",
  },
  {
    id: 3,
    question: "Do you offer airport transfers?",
    answer:
      "Yes, we offer airport transfer services for our guests. Please provide your flight details at least 24 hours prior to your arrival so we can arrange transportation for you. Additional charges apply based on the type of vehicle and distance.",
  },
  {
    id: 4,
    question: "Is there a fitness center or swimming pool?",
    answer:
      "Yes, our hotel features a fully equipped fitness center and a swimming pool. The fitness center is open 24/7 for hotel guests, and the swimming pool is open from 6:00 AM to 10:00 PM daily.",
  },
  {
    id: 5,
    question: "Do you have facilities for guests with disabilities?",
    answer:
      "Yes, we have specially designed rooms and facilities for guests with disabilities. These include wheelchair-accessible rooms, bathrooms with grab bars, and public areas with ramps and elevators. Please inform us of any specific requirements when making your reservation.",
  },
  {
    id: 6,
    question: "What is your cancellation policy?",
    answer:
      "Our standard cancellation policy allows free cancellation up to 24 hours before the check-in date. Cancellations made within 24 hours of the check-in date may be subject to a charge equivalent to one night's stay. Special rates and promotions may have different cancellation policies, so please check the terms and conditions of your specific booking.",
  },
]

export default function CustomerService() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    // Show success message
    alert("Thank you for your message. Our team will get back to you shortly.")
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>Customer Service</h1>
          <p>
            We're here to help make your stay exceptional. Find answers to common questions or contact our team for
            personalized assistance.
          </p>
        </div>
      </div>

      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqTitle}>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div>
            {faqs.map((faq) => (
              <div key={faq.id} className={styles.faqItem}>
                <div className={styles.faqQuestion} onClick={() => toggleFaq(faq.id)}>
                  <span>{faq.question}</span>
                  <span>{openFaqId === faq.id ? "−" : "+"}</span>
                </div>
                <div className={`${styles.faqAnswer} ${openFaqId === faq.id ? styles.faqAnswerOpen : ""}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.faqTitle}>
            <h2>Contact Us</h2>
            <p>Have a question or need assistance? Our customer service team is ready to help.</p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-text-light" style={{ color: "var(--text-light)" }}>
                    +1 (123) 456-7890
                  </p>
                  <p className="text-text-lighter text-sm mt-1" style={{ color: "var(--text-lighter)" }}>
                    Available 24/7 for urgent matters
                  </p>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-text-light" style={{ color: "var(--text-light)" }}>
                    customerservice@luxehotel.com
                  </p>
                  <p className="text-text-lighter text-sm mt-1" style={{ color: "var(--text-lighter)" }}>
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-text-light" style={{ color: "var(--text-light)" }}>
                    123 Luxury Avenue, Prestige District
                  </p>
                  <p className="text-text-light" style={{ color: "var(--text-light)" }}>
                    City, Country
                  </p>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Customer Service Hours</h3>
                  <p className="text-text-light" style={{ color: "var(--text-light)" }}>
                    Monday - Sunday: 8:00 AM - 8:00 PM
                  </p>
                  <p className="text-text-lighter text-sm mt-1" style={{ color: "var(--text-lighter)" }}>
                    Front desk is available 24/7
                  </p>
                </div>
              </div>
            </div>

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.formLabel}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  required
                ></textarea>
              </div>

              <button type="submit" className={`button button-primary ${styles.submitButton}`}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

