import jwt from 'jsonwebtoken';

// Create JWT token
export function createToken(user:any){
  return jwt.sign({ id: user._id }, "secret", { expiresIn: '1d' });
}

// Verify JWT token
export function verifyToken(token:string) {
  try {
    return jwt.verify(token, "secret");
  } catch (error) {
    return null;
  }
}
