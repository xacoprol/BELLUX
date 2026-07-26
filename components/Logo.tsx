import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  priority?: boolean;
  href?: string;
};

export default function Logo({
  className,
  priority = false,
  href = "#inicio",
}: LogoProps) {
  return (
    <Link href={href} className={`logo${className ? ` ${className}` : ""}`}>
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
