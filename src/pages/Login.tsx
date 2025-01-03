import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isRegister) {
        await registerUser(data.email, data.password, data.name!);
      } else {
        await login(data.email, data.password);
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0066FF] to-blue-700">
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md px-8"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-white/70">
              {isRegister
                ? "Sign up to get started with CashFlow"
                : "Sign in to your account to continue"}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded p-8 shadow-2xl shadow-blue-900/20"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {isRegister && (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("name", { required: "Name is required" })}
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <FormMessage>{errors.name.message}</FormMessage>
                  )}
                </FormItem>
              )}

              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="pl-10"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <FormMessage>{errors.password.message}</FormMessage>
                )}
              </FormItem>

              {!isRegister && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-[#0066FF] hover:text-blue-700">
                    Forgot password?
                  </a>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-blue-700 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Please wait..."
                ) : (
                  <span className="flex items-center justify-center">
                    {isRegister ? "Create Account" : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            <motion.div variants={itemVariants} className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-gray-600 hover:text-[#0066FF]"
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-white/70">
              By continuing, you agree to our{" "}
              <a href="#" className="text-white hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-white hover:underline">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:flex flex-1 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-blue-900/20" />
        </div>
      </motion.div>
    </div>
  );
}
