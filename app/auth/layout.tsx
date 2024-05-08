const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[url('/welcome_bg.jpg')]">
      <div className="flex flex-col items-center justify-center h-full bg-black w-full bg-opacity-90">
        <div className="flex items-center justify-center ">
          {children}
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;