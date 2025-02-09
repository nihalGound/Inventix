import { SignUp } from "@clerk/nextjs";
function SignUpPage() {
  return <SignUp
  appearance={{
    elements: {
      formButtonPrimary: "bg-gray-800 border-gray-700 text-white",
    }
  }}
  
  />;
}

export default SignUpPage;
