import { Resend } from 'resend';

let resend;
const getResend = () => {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
      await getResend().emails.send({
      from: 'CreatorPage <onboarding@resend.dev>',
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

export const sendCaptureConfirmation = async (visitorEmail, visitorName, creatorName) => {
  await sendEmail({
    to: visitorEmail,
    subject: `Thanks for connecting with ${creatorName}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hey ${visitorName || 'there'}! 👋</h2>
        <p>You've successfully connected with <strong>${creatorName}</strong> on CreatorPage.</p>
        <p>You'll receive updates and content from them soon.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Powered by CreatorPage</p>
      </div>
    `
  });
};

export const sendBookingConfirmation = async (visitorEmail, visitorName, creatorName, sessionName, date, slot) => {
  await sendEmail({
    to: visitorEmail,
    subject: `Booking Confirmed: ${sessionName} with ${creatorName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmed! ✅</h2>
        <p>Hey ${visitorName},</p>
        <p>Your session <strong>${sessionName}</strong> with <strong>${creatorName}</strong> is confirmed.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${slot}</p>
        </div>
        <p>See you there!</p>
      </div>
    `
  });
};

export const sendCreatorBookingNotification = async (creatorEmail, creatorName, visitorName, visitorEmail, sessionName, date, slot) => {
  await sendEmail({
    to: creatorEmail,
    subject: `New Booking: ${sessionName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking! 📅</h2>
        <p>Hey ${creatorName},</p>
        <p><strong>${visitorName}</strong> (${visitorEmail}) booked your <strong>${sessionName}</strong> session.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${slot}</p>
        </div>
      </div>
    `
  });
};

export const sendProductDownloadEmail = async (buyerEmail, buyerName, productName, downloadUrl) => {
  await sendEmail({
    to: buyerEmail,
    subject: `Your purchase: ${productName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thanks for your purchase! 🎉</h2>
        <p>Hey ${buyerName},</p>
        <p>Here's your download for <strong>${productName}</strong>:</p>
        <a href="${downloadUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0;">Download Now</a>
        <p style="color: #666; font-size: 12px;">This link is unique to you. Please don't share it.</p>
      </div>
    `
  });
};