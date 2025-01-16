function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {children}
    </a>
  );
}

export default Link;
