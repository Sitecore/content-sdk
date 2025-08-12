import Bootstrap from 'src/Bootstrap';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Bootstrap>{children}</Bootstrap>
    </>
  );
}
