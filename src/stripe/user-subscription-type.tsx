import { auth } from "../firebase/firebase";

const userSubscriptionType = async (): Promise<object | string | undefined> => {
    await auth.currentUser?.getIdToken(true);
    const decodeToken = await auth.currentUser?.getIdTokenResult();
    return decodeToken?.claims?.stripeRole;
}

export default userSubscriptionType;
