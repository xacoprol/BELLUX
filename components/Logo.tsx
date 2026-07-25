import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export default function Logo({ className, priority = false }: LogoProps) {
  return (
    <Link href="#inicio" className={`logo${className ? ` ${className}` : ""}`}>
      <Image
        src="/assets/images/logo.png"
        alt="Bellux Entertainment"
        width={1024}
        height={457}
        className="logo-img"
        priority={priority}
      />
    </Link>
  );
}
