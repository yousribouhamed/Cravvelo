import { getAllUsers } from "@/modules/users/actions/users.actions";
import UsersListingPage from "@/modules/users/pages/users-listing";

export default async function UsersPage() {
  const response = await getAllUsers({ page: 1, limit: 10 });

  if (!response.success || !response.data) {
    return (
      <div className="w-full h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error loading users
          </h2>
          <p className="text-gray-600">
            {response.error ?? "Something went wrong. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return <UsersListingPage initialData={response.data} />;
}
