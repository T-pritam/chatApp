import { Html, Tailwind, Body, Container, Heading, Text, Link } from '@react-email/components';

interface ForgotPasswordEmailProps {
  username: string;
  resetLink: string;
}
const ResetPasswordEmail = ({  username, resetLink }: ForgotPasswordEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-white">
          <Container className="mx-auto p-6">
            <Heading className="text-lg font-bold mb-4">
              Password Reset Request
            </Heading>

            <Text className="text-gray-700 mb-4">
              Hi {username},
            </Text>

            <Text className="text-gray-700 mb-4">
              We received a request to reset your password. Click the link below to reset your password:
            </Text>

            <Link href={resetLink} className="text-blue-600 hover:underline">
              Reset Your Password
            </Link>

            <Text className="text-gray-700 mt-4">
              If you did not request this, you can safely ignore this email.
            </Text>

            <Text className="text-gray-700 mt-6">
              Best regards,
              <br />
              The Support Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail