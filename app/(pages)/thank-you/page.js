// app/thank-you/page.js
import Link from "next/link";

export const metadata = {
  title: "Thank You - Order Received",
};

export default function ThankYouPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>شكراً لطلبك!</h1>
        <p style={styles.text}>
          لقد استلمنا طلبك وسنقوم بمعالجته في أقرب وقت ممكن.
        </p>
        <p style={styles.text}>
          ستتلقى بريدًا إلكترونيًا يحتوي على تفاصيل الطلب قريبًا.
        </p>
        <Link href="/" style={styles.button}>العودة إلى الصفحة الرئيسية</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "white",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#4caf50",
  },
  text: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1rem",
  },
  button: {
    marginTop: "1.5rem",
    display: "inline-block",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#4caf50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
};
