import Link from "next/link";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="#inicio" className={`logo${className ? ` ${className}` : ""}`}>
      <div className="logo-dots">
        <span className="c" />
        <span className="m" />
        <span className="y" />
      </div>
      <div className="logo-word">BELLUX</div>
      <div className="logo-sub">Entertainment</div>
    </Link>
  );
}
