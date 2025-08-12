interface TestServerProps {
  text: string;
}

export const TestServer = (props: TestServerProps) => {
  return (
    <div>
      TestServer
      <p>{props.text}</p>
    </div>
  );
};
