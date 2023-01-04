import { IsNotEmpty, IsString } from "class-validator";

export default class PostDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  constructor(name: string, description: string, content: string) {
    this.name = name;
    this.description = description;
    this.content = content;
  }
}
