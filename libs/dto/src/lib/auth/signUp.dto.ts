import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 4,
    minSymbols: 0,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
  })
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('KZ')
  phone: string;

  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
