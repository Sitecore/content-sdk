'use client';

interface TestClientProps {
  placeholders: Record<string, React.ReactNode>;
}

export const TestClient = (props: TestClientProps) => {
  return (
    <div>
      TestClient
      <p>ph1</p>
      <div>{props.placeholders['ph1']}</div>
      <p>ph2</p>
      <div>{props.placeholders['ph2']}</div>
    </div>
  );
};
