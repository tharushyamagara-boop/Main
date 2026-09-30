import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      status,
      customerName,
      email,
      serviceType,
      appointmentDateFormatted,
      preferredTime,
      locationUrl
    } = body;

    if (!email || !status) {
      return NextResponse.json(
        { error: "Booking email and target status are required." },
        { status: 400 }
      );
    }

    const cleanName = customerName || "Valued Client";
    const cleanDate = appointmentDateFormatted || "Scheduled Date";
    const cleanTime = preferredTime || "Standard Window";
    const cleanService = serviceType || "Sanitation Service";

    let emailSubject = "";
    let emailHtml = "";
    let emailText = "";

    switch (status) {
      case "confirmed":
        emailSubject = `[CONFIRMED] Your ASSERWA Service Booking (#${bookingId})`;
        emailText = `Dear ${cleanName},\n\n`
          + `Your service request for "${cleanService}" has been officially CONFIRMED.\n\n`
          + `Scheduled Date: ${cleanDate}\n`
          + `Arrival Window: ${cleanTime}\n`
          + `Location: ${locationUrl || 'On file'}\n\n`
          + `Our field technical crew has been dispatched to your designated sector. Please ensure clear vehicle access to the septic/inspection chamber.\n\n`
          + `Need to make changes or have questions? Contact our direct hotline at +250 788 497 458 or email contact@asserwa.rw.\n\n`
          + `Best regards,\nASSERWA Operations Center - Forum of Sewage Emptiers in Rwanda`;
        
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
            <div style="background: #3b66b0; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">ASSERWA Rwanda</h1>
              <p style="color: #dbeafe; margin: 4px 0 0 0; font-size: 13px;">Forum of Sewage Emptiers in Rwanda</p>
            </div>
            <div style="padding: 28px 24px;">
              <div style="display: inline-block; background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 16px;">
                Booking Confirmed
              </div>
              <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Service Appointment Scheduled</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Dear <strong>${cleanName}</strong>,<br/>
                Your booking request for <strong>${cleanService}</strong> has been reviewed and officially confirmed by our central dispatch team.
              </p>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">Schedule & Dispatch Recap</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; width: 140px;">Reference ID:</td>
                    <td style="padding: 6px 0; font-family: monospace; color: #2563eb;">#${bookingId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Service Category:</td>
                    <td style="padding: 6px 0;">${cleanService}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Date of Service:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${cleanDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Arrival Window:</td>
                    <td style="padding: 6px 0; color: #166534; font-weight: 600;">${cleanTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Location Pinpoint:</td>
                    <td style="padding: 6px 0;"><a href="${locationUrl}" style="color: #2563eb; text-decoration: underline;" target="_blank">Open GPS Location</a></td>
                  </tr>
                </table>
              </div>

              <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 16px; margin-bottom: 24px; border-radius: 0 6px 6px 0;">
                <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
                  <strong>Operator Tip:</strong> Please ensure heavy vacuum tanker vehicles have clear unblocked driveway access to your premises.
                </p>
              </div>

              <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; pt: 16px;">
                Direct Assistance Hotline: <strong style="color: #0f172a;">+250 788 497 458</strong> | KK 15 Ave, Kigali, Rwanda
              </p>
            </div>
          </div>
        `;
        break;

      case "completed":
        emailSubject = `[COMPLETED] Service Work Completed (#${bookingId}) - ASSERWA Rwanda`;
        emailText = `Dear ${cleanName},\n\n`
          + `We are pleased to notify you that the scheduled service for "${cleanService}" has been successfully completed.\n\n`
          + `Date Completed: ${cleanDate}\n`
          + `Reference Number: #${bookingId}\n\n`
          + `An official environmental compliance certificate & service receipt will be archived in accordance with Rwanda sanitation standards.\n\n`
          + `We value your feedback. If you have any questions or feedback about our team's performance, please let us know at contact@asserwa.rw.\n\n`
          + `Thank you for choosing ASSERWA certified emptiers!`;

        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
            <div style="background: #16a34a; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Service Successfully Completed</h1>
              <p style="color: #dcfce7; margin: 4px 0 0 0; font-size: 13px;">ASSERWA Certified Sanitation Team</p>
            </div>
            <div style="padding: 28px 24px;">
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Dear <strong>${cleanName}</strong>,<br/>
                Your requested sanitation operation for <strong>${cleanService}</strong> has been concluded and verified by our certified technicians.
              </p>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #334155;"><strong>Reference Code:</strong> #${bookingId}</p>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #334155;"><strong>Service:</strong> ${cleanService}</p>
                <p style="margin: 0; font-size: 13px; color: #334155;"><strong>Completed On:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>

              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #1e40af; font-weight: 600;">How was your experience?</p>
                <a href="https://asserwa.rw/contact" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 13px; font-weight: 600; border-radius: 6px;">Submit Quick Feedback</a>
              </div>

              <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                Thank you for partnering with ASSERWA to keep Rwanda clean and environmentally secure.
              </p>
            </div>
          </div>
        `;
        break;

      case "cancelled":
        emailSubject = `[UPDATE] Service Booking Cancelled (#${bookingId}) - ASSERWA Rwanda`;
        emailText = `Dear ${cleanName},\n\n`
          + `This email confirms that your service booking for "${cleanService}" (#${bookingId}) on ${cleanDate} has been cancelled.\n\n`
          + `If you did not request this cancellation or would like to reschedule for a future date, please visit our booking page at https://asserwa.rw/book or contact us directly at +250 788 497 458.\n\n`
          + `Best regards,\nASSERWA Customer Support`;

        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
            <div style="background: #dc2626; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Booking Status: Cancelled</h1>
              <p style="color: #fee2e2; margin: 4px 0 0 0; font-size: 13px;">ASSERWA Service Management</p>
            </div>
            <div style="padding: 28px 24px;">
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Dear <strong>${cleanName}</strong>,<br/>
                Your booking request for <strong>${cleanService}</strong> (#${bookingId}) previously set for <strong>${cleanDate}</strong> has been cancelled.
              </p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="/book" style="display: inline-block; background: #3b66b0; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 600; border-radius: 8px;">
                  Schedule a New Appointment
                </a>
              </div>

              <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                For questions regarding this cancellation, contact our support desk: <strong>+250 788 497 458</strong>.
              </p>
            </div>
          </div>
        `;
        break;

      default:
        emailSubject = `[UPDATE] Status Update for Booking #${bookingId}`;
        emailText = `Dear ${cleanName},\nYour booking status is now: ${status}.`;
        emailHtml = `<p>Dear ${cleanName}, your booking status has been updated to: <strong>${status}</strong>.</p>`;
    }

    // In production, integrate SendGrid, Resend, or Firebase Trigger Email extension
    // We log and return confirmation for client toast feedback
    console.log(`[TRANSACTIONAL EMAIL DISPATCH] To: ${email} | Subject: ${emailSubject}`);

    return NextResponse.json({
      success: true,
      status,
      emailSentTo: email,
      subject: emailSubject,
      dispatchedAt: new Date().toISOString(),
      message: `Branded notification dispatched to ${email}`
    });

  } catch (error: any) {
    console.error("notify-status error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch status notification: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
