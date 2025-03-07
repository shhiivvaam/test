import { auth } from "../firebase/firebase";

const isUserPremium = async (): Promise<boolean> => {
    await auth.currentUser?.getIdToken(true);
    const decodeToken = await auth.currentUser?.getIdTokenResult();
    return decodeToken?.claims?.stripeRole ? true : false;
}

export default isUserPremium;
