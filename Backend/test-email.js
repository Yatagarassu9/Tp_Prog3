import "dotenv/config";
import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "cargado ✓" : "NO CARGADO ✗");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Error de conexión con Gmail:", error.message);
  } else {
    console.log("✅ Conexión con Gmail OK. Enviando mail de prueba...");

    transporter.sendMail({
      from: `"Cráneo Barbería" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Nodemailer",
      text: "Si recibís este mail, Nodemailer está funcionando correctamente.",
    }, (err, info) => {
      if (err) {
        console.error("❌ Error al enviar:", err.message);
      } else {
        console.log("✅ Mail enviado:", info.messageId);
      }
    });
  }
});
