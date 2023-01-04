declare namespace Express {
  export interface Request {
    locals: { user: DecodedUser };
  }
}
