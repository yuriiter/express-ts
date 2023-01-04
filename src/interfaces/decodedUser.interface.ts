export default interface DecodedUser {
  sub: string;
  email: string;
  role: "ADMIN" | "USER";
}
