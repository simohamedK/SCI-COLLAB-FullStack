export class CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  institution?: string; // Le ? signifie "optionnel"
  bio?: string;
}
