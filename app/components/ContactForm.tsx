"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./ContactForm.module.css";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";

const createInitialFormState = (): FormData => ({
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
});

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(createInitialFormState());

  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    } satisfies FormData;

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let asJson: Record<string, unknown> = {};
      if (text) {
        try {
          asJson = JSON.parse(text);
        } catch {
          asJson = { error: text };
        }
      }

      if (!response.ok) {
        throw new Error(
          typeof asJson?.error === "string"
            ? asJson.error
            : "Something went wrong. Please try again later."
        );
      }

      setStatus({
        type: "success",
        message:
          typeof asJson?.message === "string"
            ? asJson.message
            : "Thank you for your message! We'll get back to you soon.",
      });

      setFormData(createInitialFormState());
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.";

      if (process.env.NODE_ENV !== "production") {
        console.error("[contact-form] submission failed:", error);
      }

      setStatus({
        type: "error",
        message,
      });
    }
  };

  const isFormValid = Object.values(formData).every(
    (value) => value.trim().length > 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className={styles.cardTitle}>
          <Mail className={styles.cardTitleIcon} />
          Send us a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status.type === "success" ? (
          <div className={styles.successState}>
            <CheckCircle className={styles.successIcon} />
            <h3 className={styles.successHeading}>Message Sent!</h3>
            <p className={styles.successText}>{status.message}</p>
            <Button
              onClick={() => setStatus({ type: "idle" })}
              className={styles.successButton}
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="Enter your first name"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={styles.input}
                placeholder="your.email@example.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="subject" className={styles.label}>
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className={styles.input}
                placeholder="What's this about?"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className={styles.textarea}
                placeholder="Tell us what's on your mind..."
              />
            </div>

            {status.type === "error" && (
              <div className={styles.errorAlert}>
                <AlertCircle className={styles.errorIcon} />
                <span className={styles.errorText}>{status.message}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isFormValid || status.type === "loading"}
              className={styles.submitButton}
            >
              {status.type === "loading" ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
