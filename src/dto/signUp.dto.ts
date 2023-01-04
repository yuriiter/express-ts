import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export default class SignUpDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(["ADMIN", "USER"])
  role: string;

  @IsString()
  @MinLength(6)
  @MaxLength(22)
  @Matches(/^.*[A-Z]+[a-z]+|[a-z]+[A-Z]+.*$/i)
  password: string;

  constructor(name: string, email: string, role: string, password: string) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
