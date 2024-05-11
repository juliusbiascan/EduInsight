interface DashboardPageProps {
  params: {
    labId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {

  return (
    <>
      Staff Page
    </>
  );
}

export default DashboardPage;