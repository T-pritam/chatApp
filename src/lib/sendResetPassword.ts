import ResetPasswordEmail from "../../emails/resetPassword";
import { resend } from "./resend";


interface ApiResponse{
    success : boolean,
    message : string
}


export async function sendResetPassword(email: string,
    username: string,
    resetLink: string): Promise<ApiResponse> {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mystery Message Verification Code',
        react: ResetPasswordEmail({ username, resetLink }),
      });
      console.log("Mail send")
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return { success: false, message: 'Failed to send verification email.' };
    }
  }