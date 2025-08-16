'use client'

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Back to top */}
      <div style={styles.backToTop} onClick={() => window.scrollTo(0, 0)}>
        الرجوع للأعلى
      </div>

      {/* روابط */}
      <div style={styles.linkSections}>
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>تعرف علينا</h4>
          <Link href="#">معلومات عن المتجر</Link>
          <Link href="#">الوظائف</Link>
          <Link href="#">الفرص التجارية</Link>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>تسوق معنا</h4>
          <Link href="#">حسابك</Link>
          <Link href="#">عربة التسوق</Link>
          <Link href="#">طلباتك</Link>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>المساعدة</h4>
          <Link href="#">الأسئلة الشائعة</Link>
          <Link href="#">سياسة الخصوصية</Link>
          <Link href="#">الشروط والأحكام</Link>
        </div>
      </div>

      {/* الشعار + الحقوق */}
      <div style={styles.bottomBar}>
        <img src="/osama.png" alt="logo" style={styles.logo} />
        <p style={styles.copyText}>© {new Date().getFullYear()}fursati جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
       backgroundColor: ' #251f35',
    color: "#fff",
    fontSize: "14px",
    direction: "rtl",
    width: "100%",
    marginTop: "50px",
  },
  backToTop: {
    backgroundColor: "#b8b2c3",
    textAlign: "center",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  linkSections: {
    display: "flex",
    justifyContent: "center",
    gap: "80px",
    padding: "40px 20px",
    flexWrap: "wrap",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: "150px",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  bottomBar: {
    borderTop: "1px solid #444",
    textAlign: "center",
    padding: "20px",
  },
  logo: {
    height: "30px",
    objectFit: "contain",
    marginBottom: "10px",
  },
  copyText: {
    fontSize: "12px",
    color: "#ccc",
  },
};
