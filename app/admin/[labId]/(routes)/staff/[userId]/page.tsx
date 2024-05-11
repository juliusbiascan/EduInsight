import { db } from "@/lib/db";
import { RegistrationForm } from "./components/registration-form";

const ProductPage = async ({ params }: { params: { labId: string, userId: string } }) => {
  const user = await db.user.findUnique({
    where: {
      id: params.userId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <RegistrationForm
          initialData={user}
        />
      </div>
    </div>
  )
}

export default ProductPage;