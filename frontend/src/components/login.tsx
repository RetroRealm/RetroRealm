import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl">
            <Image src="/placeholder.svg"
                   alt="Background"
                   className="absolute inset-0 h-full w-full object-cover"
                   width="1200"
                   height="800"
                   style={{aspectRatio: "1200/800", objectFit: "cover"}}></Image>
            <div className="relative z-10 bg-background/80 p-8 backdrop-blur-sm">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="username" type="text" placeholder="your_cool_username_1" className="w-full"/>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full pr-10"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                </div>
            </div>
        </div>
    )
        ;
}
