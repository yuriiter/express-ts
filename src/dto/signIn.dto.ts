import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export default class SignInDto {
  @IsEmail()
  email: string;

  @IsEnum(["ADMIN", "USER"])
  role: string;

  @IsString()
  @MinLength(6)
  @MaxLength(22)
  @Matches(/^.*[A-Z]+[a-z]+|[a-z]+[A-Z]+.*$/i)
  password: string;

  constructor(email: string, role: string, password: string) {
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
