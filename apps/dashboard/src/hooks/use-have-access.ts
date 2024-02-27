import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "database/src";

/**
 * A custom hook to check user access and retrieve user information from the server.
 * This function should run on the server only.
 * @returns {Promise<Object>} An object containing user information and access status.
 */
const useHaveAccess = async () => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Retrieve the current user
    const user = await currentUser();

    // Redirect to sign-in page if user is not logged in
    if (!user) {
      redirect("/sign-in");
    }

    // Retrieve account information for the user
    const account = await prisma.account.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        Website: true,
      },
    });

    // Redirect to auth-callback page if account is not found
    if (!account) {
      redirect("/auth-callback");
    }

    // Calculate trial end date
    const trialEndDate = new Date(account.createdAt);
    trialEndDate.setDate(trialEndDate.getDate() + 14);

    // Check if the user is in the free trial period
    const isFreeTrial = currentDate < trialEndDate;

    // Check if the user is subscribed (paid user)
    const isSubscribed =
      account.stripeCustomerId && account.stripeCurrentPeriodEnd ? true : false;

    // Return user information and access status
    return {
      userId: user.id,
      accountId: account.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.imageUrl,
      email: user.primaryEmailAddressId,
      isFreeTrial,
      isSubscribed,
      subdomain: account.Website[0]?.subdomain,
      customDomain: account.Website[0]?.customDomain,
      createdAt: account.createdAt,
    };
  } catch (err) {
    // Log and handle errors
    console.error(err);
  }
};

// Export the hook for use in other components
export default useHaveAccess;
