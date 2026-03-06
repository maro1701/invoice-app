import jwt from 'jsonwebtoken';

export function signToken(user){
   return jwt.sign({
      id:user.id,
      email:user.email,
      is_paid:user.is_paid
   },
process.env.JWT_SECRET,
{expiresIn:'1d'});
}

export function verifyToken(token){
   return jwt.verify(token,process.env.JWT_SECRET);
}