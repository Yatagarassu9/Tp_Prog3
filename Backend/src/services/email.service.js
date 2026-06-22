import nodemailer from "nodemailer";

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

export const sendAppointmentConfirmation = async ({ clientEmail, clientName, barberName, cutName, appointmentDate }) => {
  const date = new Date(appointmentDate);

  const formattedDate = date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12:false,
  });

  await transporter.sendMail({
    from: `"Cráneo Barbería" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: "Tu turno fue reservado",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px; border-radius: 8px;">
        <h2 style="color: #f5c518; margin-bottom: 8px;">Tu turno está confirmado</h2>
        <p style="color: #ccc; margin-bottom: 24px;">Hola ${clientName}, te esperamos en la barbería.</p>

        <div style="background: #2a2a2a; border-left: 4px solid #f5c518; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px;"><span style="color: #f5c518;">Fecha:</span> ${formattedDate}</p>
          <p style="margin: 0 0 8px;"><span style="color: #f5c518;">Hora:</span> ${formattedTime}</p>
          <p style="margin: 0 0 8px;"><span style="color: #f5c518;">Barbero:</span> ${barberName}</p>
          <p style="margin: 0;"><span style="color: #f5c518;">Servicio:</span> ${cutName}</p>
        </div>

        <p style="color: #888; font-size: 13px;">Si necesitás cancelar o modificar tu turno, ingresá a tu cuenta.</p>
      </div>
    `,
  });
};
