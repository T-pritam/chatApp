import * as React from "react";
import { Html, Head, Preview, Body, Container, Text } from "@react-email/components";

interface emailProps{
    username: string,
    otp: string
}

const VerificationEmail = ({ username, otp }:emailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code for account registration</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={title}>Hello, {username}!</Text>
          <Text style={text}>
            Thank you for signing up! To complete your registration, please use the verification code below:
          </Text>
          <Text style={code}>{otp}</Text>
          <Text style={text}>If you did not request this, please ignore this email.</Text>
          <Text style={text}>Best regards,</Text>
          <Text style={text}>The Team</Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  textAlign: "center",
};

const title = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const text = {
  fontSize: "16px",
  marginBottom: "15px",
};

const code = {
  backgroundColor: "#f0f0f0",
  borderRadius: "5px",
  display: "inline-block",
  fontSize: "20px",
  fontWeight: "bold",
  padding: "10px 20px",
  letterSpacing: "3px",
};

export default VerificationEmail;
