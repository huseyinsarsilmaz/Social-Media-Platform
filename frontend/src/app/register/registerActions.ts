import axios from "@/lib/axios";

export const sendVerificationCode = async (email: string) => {
  return await axios.post("/users/verification/email", { email });
};

export const registerUser = async (form: {
  email: string;
  username: string;
  password: string;
  name: string;
  bio: string;
  emailVerification: string;
}) => {
  return await axios.post("/auth/register", form);
};
