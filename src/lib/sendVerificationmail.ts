import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "./resend";


interface ApiResponse{
    success : boolean,
    message : string
}


export async function sendVerificationEmail(email: string,
    username: string,
    verifyCode: string): Promise<ApiResponse> {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mystery Message Verification Code',
        react: VerificationEmail({ username, otp: verifyCode }),
      });
      console.log("Mail send")
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return { success: false, message: 'Failed to send verification email.' };
    }
  }